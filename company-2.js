'use strict'
// const xlsx = require('node-xlsx').default;
const crypto = require('crypto')
const util = require('util')
const fs = require('fs')
const readFilePromise = util.promisify(fs.readFile)

const ejsexcel = require('ejsexcel')
// const Excel = require('exceljs');
const path = require('path')
const Sqlstring = require('sqlstring')
const Service = require('egg').Service
const commonCode = require('../../../common/commonCode')
const constants = require('../../../common/constants')
const tableMapIdName = tableName => `${tableName}_id`
const moment = require('moment')
const {
    ERROR,
    SUCCESS,
    FormatTime,
    Schema,
    generateObj,
    filter,
    SchemaPromise,
    SchemaTrue,
    filterTrue,
    nzh,
    curlXfyun,
    exclude
} = require('../utils/utils')
let { companyType: CompanyType } = require('../../../../shared/name2id.json')
CompanyType = CompanyType.reduce((prev, cur) => {
    prev[cur.id] = cur.name
    return prev
}, {})
class Company extends Service {
    async delCompanyStatus() {
        let datas = JSON.parse(this.ctx.params.regionHatchStatus_id)

        if(!(datas instanceof Array)){
            return {
                ...commonCode.fail,
                msg: '参数有误'
            }
        }
        let { RegionHatchStatus } = this.app.pgModel
        datas.forEach(async(el) => {
            await RegionHatchStatus.update({ isValid: 0 }, { where: { regionHatchStatus_id:el} })
        })

        return {
            ...commonCode.success
        }

    }
    async setCompanyStatus() {
        let datas = this.ctx.request.body
        console.log(11)
        if(!(datas instanceof Array)){
            return {
                ...commonCode.fail,
                msg: '参数有误'
            }
        }
        let { CompanyStatus, RegionHatchStatus } = this.app.pgModel
        datas.forEach(async(el) => {
            let obj ={}
            await Object.assign(obj,filter(el,['regionCompany_id','status_id']),{isValid:1})
            await RegionHatchStatus.findOrCreate({where:obj,defaults:obj})
        })
        // let result = await RegionHatchStatus.bulkCreate(datas)
        return{
            ...commonCode.success
        }
    }
    async find(id) {
        const company = await this.app.pgModel.Company.findById(id, {
            include: [{ model: this.app.pgModel.Shareholder }, { model: this.app.pgModel.Employee }]
        })

        if (!company) {
            return { ...ERROR, msg: 'company not found' }
        }
        return { ...SUCCESS, data: company }
    }

    async findDetail(id) {
        const {
            Company,
            Shareholder,
            Employee,
            CompanyArchive,
            CompanyFinancing,
            CompanyOperation,
            CompanyTalentStat,
            CompanyTalent,
            CompanyProduct,
            CompanyIntelRight,
            CompanyPatent,
            CompanyNeed,
            TalentPlan
        } = this.app.pgModel
        const company = await Company.findById(id, {
            include: [
                { model: Shareholder, separate: true },
                { model: Employee, separate: true },
                { model: CompanyArchive, separate: true },
                { model: CompanyFinancing, separate: true },
                { model: CompanyOperation, separate: true },
                { model: CompanyTalentStat, separate: true },
                { model: CompanyTalent, include: { model: TalentPlan }, separate: true },
                { model: CompanyProduct, separate: true },
                { model: CompanyIntelRight, separate: true },
                { model: CompanyPatent, separate: true },
                { model: CompanyNeed, separate: true }
            ]
        })
        if (!company) {
            return { ...ERROR, msg: 'company not found' }
        }
        return { ...SUCCESS, data: company }
    }

    async findFinance(id) {
        const finance = await this.app.pgModel.CompanyFinancing.findAll({
            where: { company_id: id },
            order: [['when', 'DESC']]
        })

        if (!finance) {
            return { ...ERROR, msg: 'finance not found' }
        }
        return { ...SUCCESS, data: finance }
    }

    async updateFinance({ id, updates }) {
        const { finances, del_finances } = updates
        const { Op } = this.app.Sequelize

        if (del_finances && del_finances.length) {
            const delFinances = await this.app.pgModel.CompanyFinancing.findAll({
                where: { id: { [Op.in]: del_finances } }
            })
            delFinances.map(async ele => {
                await ele.destroy()
            })
        }

        finances.forEach(async ele => {
            const finance = await this.app.pgModel.CompanyFinancing.findById(ele.id)
            if (finance) {
                await finance.update(ele)
            } else {
                ele.company_id = id
                await this.app.pgModel.CompanyFinancing.create(ele)
            }
        })

        return SUCCESS
    }

    async findArchive(id) {
        const archive = await this.app.pgModel.CompanyArchive.find({
            where: { company_id: id }
        })

        if (!archive) {
            return { ...ERROR, msg: 'archive not found' }
        }
        return { ...SUCCESS, data: archive }
    }

    async findAllCompanyArchive() {
        const archive = await this.app.pgModel.Company.findAll({
            attributes: ['id', 'name'],
            include: [{ model: this.app.pgModel.CompanyArchive }],
            order: [['name', 'DESC']]
        })

        if (!archive) {
            return { ...ERROR, msg: 'archive not found' }
        }
        return { ...SUCCESS, data: archive }
    }

    async updateArchive({ id, updates }) {
        const archive = await this.app.pgModel.CompanyArchive.findAll({
            where: { company_id: id }
        })
        if (!archive.length) {
            updates.company_id = id
            await this.app.pgModel.CompanyArchive.create(updates)
        } else {
            await archive[0].update(updates)
        }
        return SUCCESS
    }

    async operationList(id) {
        const operation = await this.app.pgModel.CompanyOperation.findAll({
            where: { company_id: id },
            order: [['year', 'DESC']]
        })
        if (!operation) {
            return { ...ERROR }
        }
        return { ...SUCCESS, data: operation }
    }

    async createOperation(operation) {
        const { ctx } = this
        try {
            if (operation.company_id && operation.year) {
                const yearStat = await this.app.pgModel.CompanyOperation.find({
                    where: {
                        year: parseInt(operation.year),
                        month: operation.month ? parseInt(operation.month) : null,
                        company_id: parseInt(operation.company_id)
                    }
                })
                console.log('yearStat', yearStat)
                if (yearStat) return { ...ERROR, msg: '已存在该月份或年份数据' }
                const res = await this.app.pgModel.CompanyOperation.create(operation)
                return { ...SUCCESS, data: res }
            } else {
                return { ...ERROR, msg: '没有关联公司' }
            }
        } catch (error) {
            ctx.status = 500
            throw error
        }
    }

    async updateOperation({ id, updates }) {
        const { ctx } = this
        try {
            const operation = await this.app.pgModel.CompanyOperation.findById(id)
            await operation.update(updates)
            return SUCCESS
        } catch (error) {
            ctx.status = 500
            throw error
        }
    }

    async talentStatList(id) {
        const talentStat = await this.app.pgModel.CompanyTalentStat.findAll({
            where: { company_id: id },
            order: [['year', 'DESC']]
        })
        if (!talentStat) {
            return { ...ERROR }
        }
        return { ...SUCCESS, data: talentStat }
    }

    async createTalentStat(talentStat) {
        const { ctx } = this
        try {
            if (talentStat.company_id && talentStat.year) {
                const yearStat = await this.app.pgModel.CompanyTalentStat.find({
                    where: {
                        company_id: talentStat.company_id,
                        year: parseInt(talentStat.year),
                        month: talentStat.month ? parseInt(talentStat.month) : null,
                    }
                })
                if (yearStat) return { ...ERROR, msg: '已存在该年份数据' }
                const res = await this.app.pgModel.CompanyTalentStat.create(talentStat)
                return { ...SUCCESS, data: res }
            } else {
                return { ...ERROR, msg: '没有关联公司' }
            }
        } catch (error) {
            ctx.status = 500
            throw error
        }
    }

    async updateTalentStat({ id, updates }) {
        const { ctx } = this
        try {
            const talentStat = await this.app.pgModel.CompanyTalentStat.findById(id)
            await talentStat.update(updates)
            return SUCCESS
        } catch (error) {
            ctx.status = 500
            throw error
        }
    }

    async talentList(id) {
        const talent = await this.app.pgModel.CompanyTalent.findAll({
            where: { company_id: id },
            order: [['name']],
            include: [{ model: this.app.pgModel.TalentPlan }]
        })
        if (!talent) {
            return { ...ERROR }
        }
        return { ...SUCCESS, data: talent }
    }

    async createTalent(talent) {
        const { ctx } = this
        try {
            if (talent.company_id) {
                const res = await this.app.pgModel.CompanyTalent.create(talent, {
                    include: [this.app.pgModel.TalentPlan]
                })
                return { ...SUCCESS, datas: res }
            } else {
                return { ...ERROR, msg: '没有关联公司' }
            }
        } catch (error) {
            ctx.status = 500
            throw error
        }
    }

    async updateTalent({ id, updates }) {
        const { ctx } = this
        const { Op } = this.app.Sequelize
        const { talent_plans, del_talent_plans } = updates

        const talent = await this.app.pgModel.CompanyTalent.findById(id)
        if (talent_plans && talent_plans.length) {
            talent_plans.forEach(async ele => {
                const plan = await this.app.pgModel.TalentPlan.findById(ele.id)
                if (plan) {
                    await plan.update(ele)
                } else {
                    ele.company_talent_id = id
                    await this.app.pgModel.TalentPlan.create(ele)
                }
            })
        }

        if (del_talent_plans && del_talent_plans.length) {
            const delPlans = await this.app.pgModel.TalentPlan.findAll({
                where: { id: { [Op.in]: del_talent_plans } }
            })

            delPlans.map(async ele => {
                await ele.destroy()
            })
        }

        if (!talent) {
            return ERROR
        }

        await talent.update(updates)
        return SUCCESS
    }

    async productList(id) {
        const product = await this.app.pgModel.CompanyProduct.findAll({
            where: { company_id: id },
            order: [['name']]
        })
        if (!product) {
            return { ...ERROR }
        }
        return { ...SUCCESS, data: product }
    }

    async createProduct(product) {
        const { ctx } = this
        try {
            if (product.company_id) {
                const res = await this.app.pgModel.CompanyProduct.create(product)
                return { ...SUCCESS, datas: res }
            } else {
                return { ...ERROR, msg: '没有关联公司' }
            }
        } catch (error) {
            ctx.status = 500
            throw error
        }
    }

    async updateProduct({ id, updates }) {
        const { ctx } = this
        try {
            const product = await this.app.pgModel.CompanyProduct.findById(id)
            await product.update(updates)
            return SUCCESS
        } catch (error) {
            ctx.status = 500
            throw error
        }
    }

    async intelRightList(id) {
        const intelRight = await this.app.pgModel.CompanyIntelRight.findAll({
            where: { company_id: id },
            order: [['year', 'DESC']]
        })
        if (!intelRight) {
            return { ...ERROR }
        }
        return { ...SUCCESS, data: intelRight }
    }

    async createIntelRight(intelRight) {
        const { ctx } = this
        try {
            if (intelRight.company_id && intelRight.year) {
                const yearStat = await this.app.pgModel.CompanyIntelRight.find({
                    where: {
                        company_id: intelRight.company_id,
                        year: parseInt(intelRight.year),
                        month: intelRight.month ? parseInt(intelRight.month) : null,
                    }
                })
                if (yearStat) return { ...ERROR, msg: '已存在该年份数据' }
                const res = await this.app.pgModel.CompanyIntelRight.create(intelRight)
                return { ...SUCCESS, datas: res }
            } else {
                return { ...ERROR, msg: '没有关联公司' }
            }
        } catch (error) {
            ctx.status = 500
            throw error
        }
    }

    async updateIntelRight({ id, updates }) {
        const { ctx } = this
        try {
            const intelRight = await this.app.pgModel.CompanyIntelRight.findById(id)
            await intelRight.update(updates)
            return SUCCESS
        } catch (error) {
            ctx.status = 500
            throw error
        }
    }

    async patentList(id) {
        const patent = await this.app.pgModel.CompanyPatent.findAll({
            where: { company_id: id },
            order: [['name']]
        })
        if (!patent) {
            return { ...ERROR }
        }
        return { ...SUCCESS, data: patent }
    }

    async createPatent(patent) {
        const { ctx } = this
        try {
            if (patent.company_id) {
                const res = await this.app.pgModel.CompanyPatent.create(patent)
                return { ...SUCCESS, datas: res }
            } else {
                return { ...ERROR, msg: '没有关联公司' }
            }
        } catch (error) {
            ctx.status = 500
            throw error
        }
    }

    async updatePatent({ id, updates }) {
        const { ctx } = this
        try {
            const patent = await this.app.pgModel.CompanyPatent.findById(id)
            await patent.update(updates)
            return SUCCESS
        } catch (error) {
            ctx.status = 500
            throw error
        }
    }

    async needList(id, { order_by = 'createdAt', order = 'DESC', page = '' }) {
        const pageSize = 10
        const currentPage = page || 1
        const skipNum = (currentPage - 1) * pageSize

        const options = {
            offset: parseInt(skipNum),
            limit: parseInt(pageSize),
            order: [[order_by, order.toUpperCase()]],
            where: { company_id: id }
            // distinct:true
        }

        const need = await this.app.pgModel.CompanyNeed.findAndCountAll(options)
        if (!need) {
            return { ...ERROR }
        }
        return { ...SUCCESS, data: need }
    }

    async createNeed(need) {
        const { ctx } = this
        try {
            if (need.company_id) {
                const res = await this.app.pgModel.CompanyNeed.create(need)
                return { ...SUCCESS, datas: res }
            } else {
                return { ...ERROR, msg: '没有关联公司' }
            }
        } catch (error) {
            ctx.status = 500
            throw error
        }
    }

    async updateNeed({ id, updates }) {
        const { ctx } = this
        try {
            const need = await this.app.pgModel.CompanyNeed.findById(id)
            await need.update(updates)
            return SUCCESS
        } catch (error) {
            ctx.status = 500
            throw error
        }
    }

    async deleteNeed(id) {
        const need = await this.app.pgModel.CompanyNeed.findById(id)
        if (!need) {
            return ERROR
        }
        await need.destroy()
        return SUCCESS
    }

    async changeList(id) {
        const self = this
        const {
            Company,
            Shareholder,
            Employee,
            CompanyArchive,
            CompanyFinancing,
            CompanyOperation,
            CompanyTalentStat,
            CompanyTalent,
            CompanyProduct,
            CompanyIntelRight,
            CompanyPatent,
            CompanyNeed,
            TalentPlan,
            CompanyChange
        } = this.app.pgModel
        const group = await CompanyChange.findAll({
            where: {
                company_id: id,
                deletedAt: null
            },
            attributes: ['type'],
            group: ['type']
        })
        // console.log('group', group)
        const list = await CompanyChange.findAll({
            where: {
                company_id: id,
                deletedAt: null
            }
        })

        const company = await Company.findById(id, {
            include: [
                { model: Shareholder, separate: true },
                { model: Employee, separate: true },
                { model: CompanyArchive, separate: true },
                { model: CompanyFinancing, separate: true },
                { model: CompanyOperation, separate: true },
                { model: CompanyTalentStat, separate: true },
                { model: CompanyTalent, include: { model: TalentPlan }, separate: true },
                { model: CompanyProduct, separate: true },
                { model: CompanyIntelRight, separate: true },
                { model: CompanyPatent, separate: true },
                { model: CompanyNeed, separate: true }
            ]
        })

        let groupList = []
        groupList = group.map(function (t) {
            let temp = {}
            let type = t.type
            let data = list.filter((item, index) => item.type === type)
            let dataTemp = data.map(v => {
                let vTemp = JSON.parse(JSON.stringify(v))
                if (!vTemp.type || !vTemp.name) return { ...ERROR, msg: '未指定表名和字段' }
                if (vTemp.type === 'Company') {
                    let dataType = self.app.pgModel[vTemp.type]['model'][vTemp.name]['key']
                    if (dataType === 'INTEGER' || dataType === 'DECIMAL') {
                        vTemp.value = Number(vTemp.value)
                    } else if (dataType === 'ARRAY') {
                        vTemp.value = JSON.parse(vTemp.value)
                    }
                    return vTemp
                } else {
                    vTemp.value = JSON.parse(vTemp.value)
                    return vTemp
                }
            })

            temp.type = type
            temp.data = dataTemp
            return temp
        })

        return { ...SUCCESS, data: groupList, company }
    }

    async changeConfirm(body) {
        const { ctx } = this
        const { Op } = this.app.Sequelize
        try {
            const { type, company_id, change_ids, data } = body
            if (!change_ids.length || !type || !company_id) return { ...commonCode.parameterError }

            if (type === 'Company') {
                const res = await this.app.pgModel[type].findById(company_id)
                await res.update(data)
                await this.app.pgModel.CompanyChange.update(
                    { deletedAt: new Date() },
                    { where: { id: { [Op.in]: change_ids } } }
                )
                return { ...SUCCESS }
            } else {
                const resDel = await this.app.pgModel[type].findAll({
                    where: { company_id: company_id }
                })

                resDel.forEach(async ele => {
                    await ele.destroy()
                })

                data.forEach(async rows => {
                    rows.forEach(ele => {
                        ele.company_id = company_id
                    })
                    const res = await this.app.pgModel[type].bulkCreate(rows)
                })

                await this.app.pgModel.CompanyChange.update(
                    { deletedAt: new Date() },
                    { where: { id: { [Op.in]: change_ids } } }
                )

                return { ...SUCCESS }
            }
        } catch (error) {
            ctx.status = 500
            throw error
        }
    }

    async changeCancel(id) {
        const res = await this.app.pgModel.CompanyChange.findById(id)
        if (!res) {
            return ERROR
        }
        await res.update({ deletedAt: new Date() })
        return SUCCESS
    }

    async deleteTalentPlan(id) {
        const table = await this.app.pgModel.TalentPlan.findById(id)

        if (!table) {
            return ERROR
        }
        await table.destroy({ paranoid: true })
        return SUCCESS
    }

    async deleteTalentStat(id) {
        const table = await this.app.pgModel.CompanyTalentStat.findById(id)

        if (!table) {
            return ERROR
        }
        await table.destroy({ paranoid: true })
        return SUCCESS
    }

    async deleteTalent(id) {
        const table = await this.app.pgModel.CompanyTalent.findById(id)

        if (!table) {
            return ERROR
        }
        await table.destroy({ paranoid: true })
        return SUCCESS
    }

    async deleteProduct(id) {
        const table = await this.app.pgModel.CompanyProduct.findById(id)

        if (!table) {
            return ERROR
        }
        await table.destroy({ paranoid: true })
        return SUCCESS
    }

    async deletePatent(id) {
        const table = await this.app.pgModel.CompanyPatent.findById(id)

        if (!table) {
            return ERROR
        }
        await table.destroy({ paranoid: true })
        return SUCCESS
    }

    async exportFile1(body) {
        const { Op } = this.app.Sequelize
        console.log(body)
        if (!Array.isArray(body.payload) || !body.payload.length)
            return { ...ERROR, msg: '请选择您要导出的数据!' }
        if (!Array.isArray(body.type) || !body.type.length) return { ...ERROR, msg: '缺失type' }
        let type = body.type[0]
        if (!['company', 'serverOrg'].includes(type)) {
            return { ...ERROR, msg: 'type只能为company与serverOrg' }
        }
        //Todo服务机构导出
        const tableColumnNames = [
            'name',
            'confCompanyClassName',
            'registeredCapital',
            'establishmentDate',
            'entryTime',
            'business',
            'confStateOccupancyName',
            'contact',
            'contactNumber',
            'remark'
        ]
        const tableColumnNameZhes = [
            '序号',
            '企业名称',
            '企业类别',
            '注册资金（万元）',
            '注册时间',
            '入孵/入园时间',
            '主营业务',
            '目前状态',
            '联系人',
            '联系方式',
            '备注'
        ]
        body.payload = body.payload.map(v => v | 0)
        // let companies = await this.app.pgModel.Company.findAll({
        //   attributes:tableColumnNames ,
        //   where: {
        //     id: {[Op.in]: body.payload }
        //   },
        //   raw:true
        // })
        let { Company, ConfStateOccupancy, ConfCompanyClass } = this.app.pgModel
        let companies = await Company.findAll({
            where: {
                company_id: { [Op.in]: body.payload }
            },
            include: [
                {
                    model: ConfStateOccupancy,
                    where: {
                        isValid: 1
                    },
                    required: false
                },
                {
                    model: ConfCompanyClass,
                    where: {
                        isValid: 1
                    },
                    required: false
                }
            ]
        })
        companies = companies.map(v => {
            v = v.get({
                plain: true
            })
            if (v.confStateOccupancy) {
                v.confStateOccupancyName = v.confStateOccupancy.name
            } else {
                v.confStateOccupancyName = null
            }
            if (v.confCompanyClass) {
                v.confCompanyClassName = v.confCompanyClass.name
            } else {
                v.confCompanyClassName = null
            }

            return filter(v, [
                'name',
                'confCompanyClassName',
                'registeredCapital',
                'establishmentDate',
                'entryTime',
                'business',
                'confStateOccupancyName',
                'contact',
                'contactNumber',
                'remark'
            ])
        })
        const mapToName = index => {
            switch (index) {
            // case 1:
            //   return value=>constants.companyCategory[value-1].name
            case 2:
                return value => value / 10000
                // case 6:
                //   return value=>constants.entryState[value-1].name
            default:
                return value => value
            }
        }
        // companies=[[...tableColumnNameZhes],...companies.map((company,i)=>[i+1,...tableColumnNames.map((name,index)=>company[name]===null?'':mapToName(index)(company[name]))])]
        companies = [
            ...companies.map((company, i) => {
                let temp = {}
                tableColumnNames.forEach((key, i) => {
                    temp[key] = company[key] === null ? '' : mapToName(i)(company[key])
                })
                return temp
            })
        ]
        const curYear = new Date().getFullYear()
        const title = `华中科技大学国家大学科技园${curYear}年度入园企业花名册`
        // const range = {s: {c: 0, r:0 }, e: {c:10, r:0}}; // A1:A4
        // const option = {'!merges': [ range ]};

        this.ctx.attachment(`${title}.xlsx`)
        this.ctx.set('Content-Type', 'application/octet-stream')
        // this.ctx.body = xlsx.build([{name: "入园企业花名册", data: companies}])
        // const mapValueToExcel=(key,value)=>{

        //   if(value===null) return ''
        //   switch(key){
        //     case 'category':
        //       return constants.companyCategory[value-1].excelName
        //     case 'registeredCapital':
        //       return value/10000
        //     case 'entryState':
        //       return constants.entryState[value-1].excelName
        //     default:
        //       return value
        //   }

        // }
        // companies=companies.map(
        //   company=>Object.entries(company)
        //     .reduce((arr,[key,value])=>{
        //       arr[key]=mapValueToExcel(key,value)
        //       return arr
        // },{}))
        // // companies=[[...tableColumnNameZhes],...companies.map((company,i)=>[i+1,...tableColumnNames.map((name,index)=>company[name]===null?'':mapToName(index)(company[name]))])]

        // const curYear = new Date().getFullYear()
        // const title = `华中科技大学国家大学科技园${curYear}年度入园企业花名册`

        // this.ctx.attachment(`${title}.xlsx`)
        // this.ctx.set('Content-Type', 'application/octet-stream')

        const data = [title, companies]
        console.log(data)
        // this.ctx.unsafeRedirect('http://localhost:7004/api/exportExcel/company')
        const exlBuf2 = await ejsexcel.renderExcel(this.app.companyExcelTemplate, data)
        // // //Todo ejsexcel存在性能问题，上述方法实测会阻塞接口
        this.ctx.body = exlBuf2
    }
    async exportFile(body) {
        let title = '2016年度华中科技大学国家大学科技园综合统计明细表'
        body.year = 2018
        let token = body.token[0]
        let { year } = body
        let { park_id } = this.ctx
        let companyCountGrowthRate = '-',
            hatchCountGrowthRate = '-',
            universityCompanyCountGrowthRate = '-',
            serverOrgGrowthRate = '-'
        let data
        const { Op, literal } = this.app.Sequelize
        year = year | 0
        let {
            ParkCount,
            ParkCountCompanyClass,
            ParkCountQualification,
            ParkCountServerClass,
            ParkCountTalentPlan
        } = this.app.pgModel
        if (body.hasOwnProperty('year')) {
            let parkCount = await ParkCount.findOne({
                where: {
                    isValid: 1,
                    park_id,
                    year
                },
                attributes: { exclude: ['isValid', 'createdAt', 'deletedAt'] },
                // attributes:{include:[['literal','']]},
                include: [
                    {
                        model: ParkCountCompanyClass,
                        where: {
                            isValid: 1
                        },
                        attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                        required: false,
                        separate: true
                    },
                    {
                        model: ParkCountQualification,
                        where: {
                            isValid: 1
                        },
                        attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                        required: false,
                        separate: true
                    },
                    {
                        model: ParkCountServerClass,
                        where: {
                            isValid: 1
                        },
                        attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                        required: false,
                        separate: true
                    },
                    {
                        model: ParkCountTalentPlan,
                        where: {
                            isValid: 1
                        },
                        attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                        required: false,
                        separate: true
                    }
                ]
            })

            let prevParkCount = await ParkCount.findOne({
                where: {
                    isValid: 1,
                    park_id,
                    year: year - 1
                },
                attributes: { exclude: ['isValid', 'createdAt', 'deletedAt'] },
                // attributes:{include:[['literal','']]},
                include: [
                    {
                        model: ParkCountCompanyClass,
                        where: {
                            isValid: 1
                        },
                        attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                        required: false,
                        separate: true
                    },
                    {
                        model: ParkCountQualification,
                        where: {
                            isValid: 1
                        },
                        attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                        required: false,
                        separate: true
                    },
                    {
                        model: ParkCountServerClass,
                        where: {
                            isValid: 1
                        },
                        attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                        required: false,
                        separate: true
                    },
                    {
                        model: ParkCountTalentPlan,
                        where: {
                            isValid: 1
                        },
                        attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                        required: false,
                        separate: true
                    }
                ]
            })
            if (parkCount) {
                parkCount = parkCount.get({
                    plain: true
                })
            }
            if (prevParkCount) {
                prevParkCount = prevParkCount.get({
                    plain: true
                })
            }
            if (parkCount && prevParkCount) {
                let serverOrgCount = parkCount.parkCountServerClasses.reduce((prev, cur) => {
                    return prev + (cur.number | 0)
                }, 0)
                let prevServerOrgCount = prevParkCount.parkCountServerClasses.reduce(
                    (prev, cur) => {
                        return prev + (cur.number | 0)
                    },
                    0
                )
                let universityCompanyCount, prevUniversityCompanyCount
                universityCompanyCount = parkCount.parkCountCompanyClasses.find(
                    v => v.name === '大学生创业'
                )
                prevUniversityCompanyCount = prevParkCount.parkCountCompanyClasses.find(
                    v => v.name === '大学生创业'
                )
                companyCountGrowthRate = parkCount.companyCount / prevParkCount.companyCount
                hatchCountGrowthRate = parkCount.hatchCount / prevParkCount.hatchCount

                serverOrgGrowthRate = serverOrgCount / prevServerOrgCount

                if (universityCompanyCount && prevUniversityCompanyCount) {
                    universityCompanyCountGrowthRate =
                        universityCompanyCount.number / prevUniversityCompanyCount.number
                }
                if (!Number.isFinite(serverOrgGrowthRate)) {
                    serverOrgGrowthRate = '-'
                    // serverOrgGrowthRate=((serverOrgGrowthRate-1)*100).toFixed(2)+'%'
                } else {
                    serverOrgGrowthRate -= 1
                }
                if (!Number.isFinite(universityCompanyCountGrowthRate)) {
                    universityCompanyCountGrowthRate = '-'
                    // universityCompanyCountGrowthRate=((universityCompanyCountGrowthRate-1)*100).toFixed(2)+'%'
                } else {
                    universityCompanyCountGrowthRate -= 1
                }
                if (!Number.isFinite(companyCountGrowthRate)) {
                    companyCountGrowthRate = '-'
                    // companyCountGrowthRate=((companyCountGrowthRate-1)*100).toFixed(2)+'%'
                } else {
                    companyCountGrowthRate -= 1
                }
                if (!Number.isFinite(hatchCountGrowthRate)) {
                    hatchCountGrowthRate = '-'
                    // hatchCountGrowthRate=((hatchCountGrowthRate-1)*100).toFixed(2)+'%'
                } else {
                    hatchCountGrowthRate -= 1
                }
            }

            let counts = {
                ...(parkCount || {
                    year, //年份

                    // 经营信息 -------------------------------------
                    yearlyIncoming: 0, // 本年度总收入0
                    yearlyRDFund: 0, // 年度研究与试验发展经费0
                    taxPayed: 0, // 实际上缴税费0

                    //数量统计
                    companyCount: 0, //企业数量
                    hatchCount: 0, //在孵数量

                    // 国家政策支持 -------------------------------------
                    nationalRDProject: 0, // 承担国家科研和产业化项目（项）
                    nationalRDFinancing: 0, // 承担国家科研和产业化获得资助（元）
                    ProvinceRDProject: 0, // 承担省市区科研开发项目（项）
                    ProvinceRDFinancing: 0, // 承担省市区科研开发项目获得资助金额（元）

                    //人员层次统计
                    rd: 0, // 研发人员
                    science: 0, // 科技活动人员
                    doctor: 0, // 博士人数
                    master: 0, // 硕士人数
                    postgraduate: 0, // 研究生人数
                    bachelor: 0, // 本科生人数
                    overseas: 0, // 留学人数
                    college: 0, // 大专生人数
                    secondary: 0, // 中专生人数
                    internship: 0, // 接纳大学生、研究生实习人员
                    freshGraduate: 0, // 接纳应届毕业生就业人员

                    //知识产权分布
                    proprietary: 0, //自主知识产权
                    invention: 0, //发明专利
                    utility: 0, //实用专利
                    appearance: 0, //外观专利
                    PCT: 0,
                    trademark: 0, //商标
                    copyright: 0, //著作权
                    ic: 0, //集成电路
                    software: 0, //软件产品
                    parkCountCompanyClasses: [],
                    parkCountServerClasses: [],
                    parkCountTalentPlans: [],
                    parkCountQualifications: []
                })
            }
            const data = [title, [counts], { a: 1, b: 2, c: 3, d: 4 }]
            console.log(data)

            this.ctx.attachment(`${title}.xlsx`)
            this.ctx.set('Content-Type', 'application/octet-stream')
            const exlBuf2 = await ejsexcel.renderExcel(this.app.countExcelTemplate, data)
            this.ctx.cookies.set('token', token, {
                httpOnly: false,
                signed: false
            })

            // //Todo ejsexcel存在性能问题，上述方法实测会阻塞接口
            this.ctx.body = exlBuf2
        } else {
            let parkCounts = await ParkCount.findAll({
                where: {
                    isValid: 1,
                    park_id
                },
                attributes: { exclude: ['isValid', 'createdAt', 'deletedAt'] },
                // attributes:{include:[['literal','']]},
                include: [
                    {
                        model: ParkCountCompanyClass,
                        where: {
                            isValid: 1
                        },
                        attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                        required: false,
                        separate: true
                    },
                    {
                        model: ParkCountQualification,
                        where: {
                            isValid: 1
                        },
                        attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                        required: false,
                        separate: true
                    },
                    {
                        model: ParkCountServerClass,
                        where: {
                            isValid: 1
                        },
                        attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                        required: false,
                        separate: true
                    },
                    {
                        model: ParkCountTalentPlan,
                        where: {
                            isValid: 1
                        },
                        attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                        required: false,
                        separate: true
                    }
                ]
            })
            parkCounts = parkCounts.map(v => {
                return v.get({
                    plain: true
                })
            })
            let countField = [
                'yearlyIncoming',
                'yearlyRDFund',
                'taxPayed',
                'companyCount',
                'hatchCount',
                'nationalRDProject',
                'nationalRDFinancing',
                'ProvinceRDProject',
                'ProvinceRDFinancing',
                'rd',
                'science',
                'doctor',
                'master',
                'postgraduate',
                'bachelor',
                'overseas',
                'college',
                'secondary',
                'internship',
                'freshGraduate',
                'proprietary',
                'invention',
                'utility',
                'appearance',
                'PCT',
                'trademark',
                'copyright',
                'ic',
                'software'
            ]
            let parkCountDatas = {
                parkCountCompanyClasses: [],
                parkCountServerClasses: [],
                parkCountTalentPlans: [],
                parkCountQualifications: []
            }
            countField.forEach(key => {
                parkCountDatas[key] = 0
            })
            for (const parkCount of parkCounts) {
                countField.forEach(key => {
                    parkCountDatas[key] += parkCount[key] | 0
                })
                let {
                    parkCountCompanyClasses: _parkCountCompanyClasses,
                    parkCountServerClasses: _parkCountServerClasses,
                    parkCountTalentPlans: _parkCountTalentPlans,
                    parkCountQualifications: _parkCountQualifications
                } = parkCountDatas
                let {
                    parkCountCompanyClasses,
                    parkCountServerClasses,
                    parkCountTalentPlans,
                    parkCountQualifications
                } = parkCount
                console.log(parkCountCompanyClasses)
                parkCountCompanyClasses.forEach(v => {
                    let companyClass = _parkCountCompanyClasses.find(_v => _v.name === v.name)
                    if (companyClass) {
                        companyClass.number += v.number
                    } else {
                        _parkCountCompanyClasses.push({ name: v.name, number: v.number })
                    }
                })
                parkCountServerClasses.forEach(v => {
                    let companyClass = _parkCountServerClasses.find(_v => _v.name === v.name)
                    if (companyClass) {
                        companyClass.number += v.number
                    } else {
                        _parkCountServerClasses.push({ name: v.name, number: v.number })
                    }
                })
                parkCountTalentPlans.forEach(v => {
                    let companyClass = _parkCountTalentPlans.find(_v => _v.name === v.name)
                    if (companyClass) {
                        companyClass.number += v.number
                    } else {
                        _parkCountTalentPlans.push({ name: v.name, number: v.number })
                    }
                })
                parkCountQualifications.forEach(v => {
                    let companyClass = _parkCountQualifications.find(_v => _v.name === v.name)
                    if (companyClass) {
                        companyClass.number += v.number
                    } else {
                        _parkCountQualifications.push({ name: v.name, number: v.number })
                    }
                })
            }
            return {
                ...commonCode.success,
                datas: parkCountDatas
            }
        }
    }

    async getConfTag() {
        let { park_id } = this.ctx
        let { ConfTag } = this.app.pgModel
        let datas = await ConfTag.findAll({
            where: {
                park_id,
                isValid: 1
            },
            attributes: ['confTag_id', 'name'],
            raw: true
        })
        return {
            ...commonCode.success,
            datas
        }
    }

    async getConfStateOccupancy() {
        let { park_id } = this.ctx
        let { ConfStateOccupancy } = this.app.pgModel
        let datas = await ConfStateOccupancy.findAll({
            where: {
                park_id,
                isValid: 1
            },
            attributes: ['confStateOccupancy_id', 'name'],
            raw: true
        })
        return {
            ...commonCode.success,
            datas
        }
    }

    async getConfCompanyClass() {
        let { park_id } = this.ctx
        let { ConfCompanyClass } = this.app.pgModel
        let datas = await ConfCompanyClass.findAll({
            where: {
                park_id,
                isValid: 1
            },
            attributes: ['confCompanyClass_id', 'name'],
            raw: true
        })
        return {
            ...commonCode.success,
            datas
        }
    }
    async getConfQualification() {
        let { park_id } = this.ctx
        let { ConfQualification } = this.app.pgModel
        let datas = await ConfQualification.findAll({
            where: {
                park_id,
                isValid: 1
            },
            attributes: ['confQualification_id', 'name'],
            raw: true
        })
        return {
            ...commonCode.success,
            datas
        }
    }

    async addCompany(body) {
        let {
            name,
            entryTime,
            confQualification_id = [],
            confTag_id = [],
            confStateOccupancy_id,
            confCompanyClass_id,
            business,
            contact,
            contactNumber,
            teamSize,
            address,
            remark,
            logo,
            hatchStatus,
            leaveTime,
            /**新增字段 */
            contactEmail, //联系人邮箱
            safetyResponsiblePerson, // 安全责任人：
            // corporateIdentityCard,  //法人身份证：
            // corporateSex,  //法人性别: 1男， 2女
            fristRegisteredCapital, //*企业成立时注册资本(万元)
            industryType, //行业类别
            teamType = 1,
            lib,
            contacts,
            region_id
        } = body
        if (teamType === 2) {
            lib = 2
        } else if (teamType === 1) {
            if (!lib) lib = 1
        }
        await SchemaPromise(body, ['name', 'entryTime'])
        let { park_id } = this.ctx
        let {
            Company,
            CompanyQualification,
            CompanyConfTag,
            CompanyFiles,
            ConfCompanyInfoType,
            RegionCompany
        } = this.app.pgModel
        let company = await new Promise((resolve, reject) => {
            Company.findOrCreate({
                where: {
                    isValid: 1,
                    park_id,
                    name
                },
                defaults: {
                    name,
                    entryTime,
                    confStateOccupancy_id,
                    confCompanyClass_id,
                    business,
                    contact,
                    contactNumber,
                    teamSize,
                    address,
                    remark,
                    logo,
                    leaveTime,
                    hatchStatus,
                    /**新增字段 */
                    contactEmail, //联系人邮箱
                    safetyResponsiblePerson, // 安全责任人：
                    // corporateIdentityCard,  //法人身份证：
                    // corporateSex,  //法人性别: 1男， 2女
                    fristRegisteredCapital, //*企业成立时注册资本(万元)
                    industryType, //行业类别
                    teamType,
                    lib,
                    contacts
                }
            }).spread((company, created) => {
                if (created) {
                    resolve(
                        company.get({
                            plain: true
                        })
                    )
                } else {
                    resolve(false)
                }
            })
        })
        if (!company) {
            return {
                ...commonCode.fail,
                msg: '企业已存在'
            }
        } else {
            await Promise.all([
                CompanyQualification.bulkCreate(
                    confQualification_id.map(v => ({
                        confQualification_id: v,
                        company_id: company.company_id
                    }))
                ),
                CompanyConfTag.bulkCreate(
                    confTag_id.map(v => ({ confTag_id: v, company_id: company.company_id }))
                ),
                (async () => {
                    let confCompanyInfoTypes = await ConfCompanyInfoType.findAll({
                        where: {
                            isValid: 1,
                            park_id
                        },
                        attributes: ['confCompanyInfoType_id']
                    })
                    await CompanyFiles.bulkCreate(
                        confCompanyInfoTypes.map(v => ({
                            company_id: company.company_id,
                            confCompanyInfoType_id: v.confCompanyInfoType_id
                        }))
                    )
                })(),
                RegionCompany.create({
                    company_id: company.company_id,
                    region_id,
                    lib,
                    entryTime,
                    confStateOccupancy_id,
                    address,
                    safetyResponsiblePerson,
                    contacts,
                    // responsiblePersonContactNumber
                    // floorSpace
                }),

            ])
            return {
                ...commonCode.success,
                datas: {
                    company_id: company.company_id
                }
            }
        }
    }

    /**
     * 主营业务为空的时候，用经营范围替代
     */
    // async getCompanyList(body){
    //     let { park_id } = this.ctx
    //     let { user_id } = this.ctx.session.user
    //     let {
    //         name,
    //         pageSize = 10,
    //         page = 1,
    //         sortField,
    //         sortOrder,
    //         start_register,
    //         end_register,
    //         establish_start_time,
    //         establish_end_time,
    //         entry_start_time,
    //         entry_end_time,
    //         confStateOccupancy_id,
    //         business,
    //         teamType = 1,
    //         lib,   

    //         //团队新增查询字段
    //         contact,
    //         contactNumber,
    //         patent_count_start,
    //         patent_count_end,
    //         publicCompanyType,
    //         confQualifications,
    //         region_id

    //     } = body
    //     let fields=['name','business','establish_start_time','establish_end_time','confStateOccupancy_id','entry_start_time','establish_end_time','start_register','end_register']
    //     fields.forEach(v=>body[v]=Sqlstring.escape(v))
    //     let where=''
    //     let query=[{
    //         field:'name',
    //         text:'name = ?'
    //     },{
    //         field:'business',
    //         text:'business=? or operationRange=?'
    //     },{
    //         field:'confStateOccupancy_id',
    //         text:'confStateOccupancy_id=?'
    //     }]
    //     if(body['establish_start_time']&&body['establish_end_time']){
    //         where+=' registeredCapital'
    //     }
    //     this.app.pgModel.query('select company.name as name,region.name as regionName,(case when business is null then  operationRange else business end) as business ,regionCompany.address as address,regionCompany.confStateOccupancy_id as confStateOccupancy_id,regionCompany.entryTime as entryTime from regionCompany inner join company on company.company_id=regionCompany.company_id inner join region on region.region_id= regionCompany.region_id where \
    //     union select name  ,null as regionName,(case when business is null then  operationRange else business end) as business,address,confStateOccupancy_id,entryTime from company')
    // }
    async getCompanyList(body) {
        let { park_id } = this.ctx
        let { user_id } = this.ctx.session.user
        let {
            name,
            pageSize = 10,
            page = 1,
            sortField,
            sortOrder,
            start_register,
            end_register,
            establish_start_time,
            establish_end_time,
            entry_start_time,
            entry_end_time,
            confStateOccupancy_id,
            business,
            teamType = 1,
            lib,

            //团队新增查询字段
            contact,
            contactNumber,
            patent_count_start,
            patent_count_end,
            softwareCopyright_count_start,
            softwareCopyright_count_end,
            companyTrademark_count_start,
            companyTrademark_count_end,
            worksCopyright_count_start,
            worksCopyright_count_end,
            publicCompanyType,
            confQualifications,
            region_id

        } = body
        let { Company,RegionHatchStatus, ConfStateOccupancy, Region, RegionCompany, CompanyStore, ConfQualification, CompanyNeed, TalentRecruit } = this.app.pgModel
        const { Op, literal } = this.app.Sequelize
        page = page | 0
        pageSize = pageSize | 0
        let company_id_scope = {}

        if (teamType === 2) {
            lib = 2
        } else {
            if (!lib) {
                lib = 1
            }
        }
        let companyWhere = {
            isValid: 1,
            park_id,
            teamType,
            lib
        }
        if (patent_count_start || patent_count_end || softwareCopyright_count_start || softwareCopyright_count_end || companyTrademark_count_start || companyTrademark_count_end || worksCopyright_count_start || worksCopyright_count_end || confQualifications) {
            company_id_scope[Op.and] = []
            if (patent_count_start && patent_count_end) {
                company_id_scope[Op.and].push(literal(`select company_id from companyPatent where isValid=1 group by company_id having count(company_id)>=${patent_count_start} and count(company_id)<=${patent_count_end} `))
            } else if (patent_count_start) {
                company_id_scope[Op.and].push(literal(`select company_id from companyPatent where isValid=1 group by company_id having count(company_id)>=${patent_count_start} `))
            } else if (patent_count_end) {
                company_id_scope[Op.and].push(literal(`select company_id from companyPatent where isValid=1 group by company_id having count(company_id)<=${patent_count_end} `))
            }
            if (softwareCopyright_count_start && softwareCopyright_count_end) {
                company_id_scope[Op.and].push(literal(`select company_id from softwareCopyright where isValid=1 group by company_id having count(company_id)>=${softwareCopyright_count_start} and count(company_id)<=${softwareCopyright_count_end} `))
            } else if (softwareCopyright_count_start) {
                company_id_scope[Op.and].push(literal(`select company_id from softwareCopyright where isValid=1 group by company_id having count(company_id)>=${softwareCopyright_count_start} `))
            } else if (softwareCopyright_count_end) {
                company_id_scope[Op.and].push(literal(`select company_id from softwareCopyright where isValid=1 group by company_id having count(company_id)<=${softwareCopyright_count_end} `))
            }
            if (companyTrademark_count_start && companyTrademark_count_end) {
                company_id_scope[Op.and].push(literal(`select company_id from companyTrademark where isValid=1 group by company_id having count(company_id)>=${companyTrademark_count_start} and count(company_id)<=${companyTrademark_count_end} `))
            } else if (companyTrademark_count_start) {
                company_id_scope[Op.and].push(literal(`select company_id from companyTrademark where isValid=1 group by company_id having count(company_id)>=${companyTrademark_count_start} `))
            } else if (companyTrademark_count_end) {
                company_id_scope[Op.and].push(literal(`select company_id from companyTrademark where isValid=1 group by company_id having count(company_id)<=${companyTrademark_count_end} `))
            }
            if (worksCopyright_count_start && worksCopyright_count_end) {
                company_id_scope[Op.and].push(literal(`select company_id from worksCopyright where isValid=1 group by company_id having count(company_id)>=${worksCopyright_count_start} and count(company_id)<=${worksCopyright_count_end} `))
            } else if (worksCopyright_count_start) {
                company_id_scope[Op.and].push(literal(`select company_id from worksCopyright where isValid=1 group by company_id having count(company_id)>=${worksCopyright_count_start} `))
            } else if (worksCopyright_count_end) {
                company_id_scope[Op.and].push(literal(`select company_id from worksCopyright where isValid=1 group by company_id having count(company_id)<=${worksCopyright_count_end} `))
            }
            if (confQualifications && Array.isArray(confQualifications) && confQualifications.length) {
                company_id_scope[Op.and].push(literal(`select company_id from companyQualification where confQualification_id in (${confQualifications.join(',')}) and isValid=1 group by company_id having count(*)=${confQualifications.length}`))
            }
            company_id_scope[Op.and] = company_id_scope[Op.and].map(v => {
                return {
                    [Op.in]: [v]
                }
            })

            companyWhere.company_id = company_id_scope
        }


        let options = {

            where: companyWhere,
            attributes: {
                exclude: [
                    'isValid',
                    'createdAt',
                    'updatedAt',
                    'deletedAt',
                    'corporateIdentityCard',
                    'corporateSex'
                ],
                include: [[literal('(select count(*) from companyPatent where companyPatent.company_id = company.company_id and isValid=1)'), 'patentCount'],
                    [literal('(select count(*) from companyTrademark where companyTrademark.company_id = company.company_id and isValid=1)'), 'companyTrademarkCount'],
                    [literal('(select count(*) from worksCopyright where worksCopyright.company_id = company.company_id and isValid=1)'), 'worksCopyrightCount'],
                    [literal('(select count(*) from softwareCopyright where softwareCopyright.company_id = company.company_id and isValid=1)'), 'softwareCopyrightCount']]
            },
            // distinct: true,
            include: [
                {
                    model: CompanyNeed,
                    where: { isValid: 1 },
                    attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                    required: false,
                    include:[
                        {
                            model: TalentRecruit,
                            where: { isValid: 1 },
                            attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                            required: false
                        }
                    ]
                },
                {
                    model: ConfStateOccupancy,
                    where: {
                        isValid: 1
                    },
                    required: false
                },
                {
                    model: CompanyStore,
                    where: {
                        user_id
                    },
                    required: false
                },
                {
                    model: ConfQualification,
                    where: {
                        isValid: 1
                    },
                    attributes: ['name', 'confQualification_id'],
                    through: {
                        where: {
                            isValid: 1
                        },
                        attributes: {
                            exclude: [
                                'isValid',
                                'createdAt',
                                'updatedAt',
                                'deletedAt'
                            ]
                        },
                    },
                    required: false
                }
            ],
            // order: [
            //     [this.app.Sequelize.fn('ifnull', this.app.Sequelize.col('changeFlag'), 0), 'DESC'],
            //     // ['changeFlag', 'DESC'],
            //     ['changTime', 'DESC'],
            //     [literal('entryTime is not null'), 'DESC'],
            //     [this.app.Sequelize.col('entryTime'), 'DESC'],
            //     [literal('convert(company.name using gbk)')]
            // ]
        }
        let where = options.where

        if (name) {
            where.name = {
                [Op.like]: `%${name}%`
            }
        }
        if (publicCompanyType) {
            where.publicCompanyType = publicCompanyType
            where.isPublicCompany = 1
        }

        if (business) {
            where[Op.or] = [
                {
                    business: null,
                    operationRange: {
                        [Op.like]: `%${business}%`
                    }
                },
                {
                    business: {
                        [Op.like]: `%${business}%`
                    }
                }
            ]
        }
        if (contact) {
            where.contact = { [Op.like]: `%${contact}%` }
        }
        if (contactNumber) {
            where.contactNumber = { [Op.like]: `%${contactNumber}%` }
        }

        if (start_register || end_register) {
            where.registeredCapital = {}
            if (start_register) {
                where.registeredCapital[Op.gte] = start_register
            }
            if (end_register) {
                where.registeredCapital[Op.lte] = end_register
            }
        }
        if (establish_start_time || establish_end_time) {
            where.establishmentDate = {}
            if (establish_start_time) {
                where.establishmentDate[Op.gte] = establish_start_time
            }
            if (establish_end_time) {
                where.establishmentDate[Op.lte] = establish_end_time
            }
        }
        if (entry_start_time || entry_end_time) {
            where.entryTime = {}
            if (entry_start_time) {
                where.entryTime[Op.gte] = entry_start_time
            }
            if (entry_end_time) {
                where.entryTime[Op.lte] = entry_end_time
            }
        }
        if (confStateOccupancy_id) {
            where.confStateOccupancy_id = confStateOccupancy_id
        }
        let order=[
            [this.app.Sequelize.fn('ifnull', literal('`company.changeFlag`'), 0), 'DESC'],
            [literal('`company.changeFlag`'), 'DESC'],
            // [literal('`company.changTime`'), 'DESC'],
            [literal('`company.entryTime` is not null'), 'DESC'],
            [literal('`company.entryTime`'), 'DESC'],
            [literal('convert(`company.name` using gbk)')]
        ]
        if(sortField==='recognition'&&sortOrder){
            order = [
                [this.app.Sequelize.fn('ifnull', literal('`company.changeFlag`'), 0), 'DESC'],
                [literal(`\`company.${sortField}\` is not null`),'DESC' ],
                [literal(`\`company.${sortField}\``), sortOrder.toUpperCase()],
                [literal('`company.entryTime` is not null'), 'DESC'],
                [literal('`company.entryTime`'), 'DESC'],
                [literal('convert(`company.name` using gbk)')]
            ]
        }else if(sortField&&sortOrder){
            order = [
                [this.app.Sequelize.fn('ifnull', literal('`company.changeFlag`'), 0), 'DESC'],
                [literal(`\`company.${sortField}\` is not null`),'DESC' ],
                [literal(`\`company.${sortField}\``), sortOrder.toUpperCase()],
                [literal('convert(`company.name` using gbk)')]
            ]
        }
        // console.log(result)
        console.log(options)
        // console.log('options',options)

        let regionCompanyWhere = {
            isValid: 1,
        }
        if (body.region_id) regionCompanyWhere.region_id = body.region_id
        let result = await RegionCompany.findAndCountAll({
            where: regionCompanyWhere,
            offset: (page - 1) * pageSize,
            limit: pageSize,
            distinct: true,
            order ,
            include: [{
                model: Company,
                ...options,
                separate: false
            }, {
                model: Region,
                where: {
                    isValid: 1
                },
                attributes: ['name', 'region_id'],
                required: false
            },{
                model:RegionHatchStatus,
                where:{
                    isValid:1
                },
                attributes: ['name', 'status_id','regionHatchStatus_id'],
                required:false
            }]
        })
        // let result = await Company.findAndCountAll(options)
        let count = result.count
        let datas = result.rows
        console.log(result)
        datas = datas.map(v => {
            v = v.get({
                plain: true
            })
            let company = v.company
            company.stateOccupancyName = company.confStateOccupancy && company.confStateOccupancy.name
            if (company.confStateOccupancy) {
                delete company.confStateOccupancy
            }
            company.companyStore = company.companyStores[0] || null
            delete company.companyStores
            company.confQualifications = company.confQualifications.map(qua => {
                return {
                    name: qua.name,
                    confQualification_id: qua.confQualification_id,
                    companyQualification_id: qua.companyQualification.companyQualification_id
                }
            })
            return {
                // regionName: v.region && v.region.name,
                ...v.company,
                // region:v.region,
                region_id: v.region && v.region.region_id,
                companyStatus:v.regionHatchStatuses,
                // lib: v.lib,
                regionCompany_id: v.regionCompany_id,
                entryTime: v.entryTime,
                confStateOccupancy_id: v.confStateOccupancy_id,
                address: v.address,
                floorSpace: v.floorSpace,
                safetyResponsiblePerson: v.safetyResponsiblePerson,
                responsiblePersonContactNumber: v.responsiblePersonContactNumber
            }
        })
        return {
            ...commonCode.success,
            datas: datas,
            count
        }
        datas = datas.map(v => {
            v = v.get({
                plain: true
            })

            v.stateOccupancyName = v.confStateOccupancy && v.confStateOccupancy.name
            if (v.confStateOccupancy) {
                delete v.confStateOccupancy
            }
            v.companyStore = v.companyStores[0] || null
            delete v.companyStores
            v.confQualifications = v.confQualifications.map(qua => {
                return {
                    name: qua.name,
                    confQualification_id: qua.confQualification_id,
                    companyQualification_id: qua.companyQualification.companyQualification_id
                }
            })
            return v
        })
        return {
            ...commonCode.success,
            datas,
            count
        }
    }


    //获取全部企业、团队
    async getAllCompany(body) {
        let { teamType } = body
        let { park_id } = this.ctx
        let { Company,RegionCompany } = this.app.pgModel
        let options = {
            where: {
                isValid: 1,
                park_id
            },
            raw:true,
            include:[{
                model:RegionCompany,
                where:{isValid:1},
                attributes:['regionCompany_id']
            }],
            attributes: ['company_id', 'name', 'teamType','lib']
        }
        if (teamType) {
            options.teamType = teamType
        }
        let result = await Company.findAll(options)
        result = result.map(v=>{
            let temp = {...v,regionCompany_id:v['regionCompanies.regionCompany_id']}
            delete temp['regionCompanies.regionCompany_id']
            return temp
        })
        if (!result) {
            return {
                ...commonCode.fail
            }
        }
        return {
            ...commonCode.success,
            datas: result
        }
    }
    async getCompanyInfo(body) {
        let { company_id } = body
        // console.log(this.app.pgModel.Company.)
        if (!company_id) {
            return {
                ...commonCode.parameterError
            }
        }
        company_id = company_id | 0
        let {
            Company,
            ConfStateOccupancy,
            ConfQualification,
            CompanyQualification,
            ConfCompanyInfoType,
            ConfCompanyClass,
            CompanyShareholders,
            CompanyEmployees,
            ConfTag,
            CooperativeCompany,
            ConfFieldOfTechnology,
            HeightCopmanyFile,
            PublicCompanyFile,
            File,
            CompanyNationISO,
            RegionCompany
        } = this.app.pgModel
        let company = await Company.findOne({
            where: {
                isValid: 1,
                company_id
            },
            attributes: {
                exclude: [
                    'isValid',
                    'createdAt',
                    'updatedAt',
                    'deletedAt',
                    'corporateIdentityCard',
                    'corporateSex'
                ]
            },
            include: [
                {
                    model: ConfStateOccupancy,
                    where: {
                        isValid: 1
                    },
                    attributes: ['name'],
                    required: false
                },
                {
                    model: ConfCompanyClass,
                    where: {
                        isValid: 1
                    },
                    attributes: ['name'],
                    required: false
                },
                {
                    model: ConfTag,
                    where: {
                        isValid: 1
                    },
                    through: {
                        where: {
                            isValid: 1
                        }
                    },
                    required: false
                },
                {
                    model: ConfQualification,
                    where: {
                        isValid: 1
                    },
                    through: {
                        where: {
                            isValid: 1
                        }
                    },
                    required: false
                },
                {
                    model: ConfCompanyInfoType,
                    where: {
                        isValid: 1
                    },
                    through: {
                        where: {
                            isValid: 1
                        }
                    },
                    required: false
                },
                {
                    model: ConfFieldOfTechnology,
                    where: {
                        isValid: 1
                    },
                    required: false
                },
                {
                    model: CompanyEmployees,
                    where: {
                        isValid: 1
                    },
                    attributes: ['companyEmployees_id', 'name', 'position', 'company_id'],
                    required: false,
                    separate: true
                },
                {
                    model: CompanyShareholders,
                    where: {
                        isValid: 1
                    },
                    required: false,
                    attributes: [
                        'companyShareholders_id',
                        'name',
                        'holdingRate',
                        'investmentAmount',
                        'company_id',
                        'type'
                    ],
                    separate: true
                },
                {
                    model: CooperativeCompany,
                    where: {
                        isValid: 1
                    },
                    required: false,
                    attributes: ['cooperativeCompany_id', 'name', 'company_id'],
                    separate: true
                },
                {
                    model: HeightCopmanyFile,
                    where: {
                        isValid: 1
                    },
                    required: false,
                    attributes: ['heightCopmanyFile_id', 'file_id', 'company_id'],
                    separate: true,
                    include: [
                        {
                            model: File,
                            where: {
                                isValid: 1
                            },
                            attributes: ['file_id', 'type', 'fileName']
                        }
                    ]
                },
                {
                    model: PublicCompanyFile,
                    where: {
                        isValid: 1
                    },
                    required: false,
                    attributes: ['publicCompanyFile_id', 'company_id', 'file_id'],
                    separate: true,
                    include: [
                        {
                            model: File,
                            where: {
                                isValid: 1
                            },
                            attributes: ['file_id', 'type', 'fileName']
                        }
                    ]
                }, {
                    model: CompanyNationISO,
                    where: {
                        isValid: 1
                    },
                    required: false,
                    attributes: {
                        exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt']
                    },
                    separate: true
                }, {
                    model: RegionCompany,
                    where: {
                        isValid: 1
                    },
                    required: false,
                    attributes: ['regionCompany_id', 'company_id'],
                    separate: true
                }
            ]
        })
        if (!company) {
            return {
                ...commonCode.fail,
                msg: '企业不存在'
            }
        }
        company = company.get({
            plain: true
        })
        // console.log(company.companyNationISOs)
        company.shareholderInfo = []
        company.employeesInfo = []
        company.qualificationInfo = []
        company.tags = []
        for (const shareholder of company.companyShareholders) {
            company.shareholderInfo.push(shareholder)
        }
        for (const employee of company.companyEmployees) {
            company.employeesInfo.push(employee)
        }
        for (const {
            name,
            confQualification_id,
            companyQualification: { companyQualification_id }
        } of company.confQualifications) {
            company.qualificationInfo.push({
                name,
                confQualification_id,
                companyQualification_id
            })
        }
        for (const {
            name,
            confTag_id,
            companyConfTag: { companyConfTag_id }
        } of company.confTags) {
            company.tags.push({
                name,
                companyConfTag_id,
                confTag_id
            })
        }

        if (company.confCompanyClass) {
            company.companyClassName = company.confCompanyClass && company.confCompanyClass.name
        } else {
            company.confCompanyClass_id = null
        }
        if (company.confStateOccupancy) {
            company.stateOccupancyName =
                company.confStateOccupancy && company.confStateOccupancy.name
        } else {
            company.confStateOccupancy_id = null
        }
        if (company.confFieldOfTechnology) {
            company.companyFieldOfTechnology =
                company.confFieldOfTechnology && company.confFieldOfTechnology.name
        } else {
            company.confFieldOfTechnology_id = null
        }
        let heightCopmanyFiles = company.heightCopmanyFiles.map(v => {
            return {
                file_id: v.file_id,
                fileName: v.file.fileName,
                type: v.file.type,
                heightCopmanyFile_id: v.heightCopmanyFile_id
            }
        })
        let publicCompanyFiles = company.publicCompanyFiles.map(v => {
            return {
                file_id: v.file_id,
                fileName: v.file.fileName,
                type: v.file.type,
                publicCompanyFile_id: v.publicCompanyFile_id
            }
        })
        // return {
        //   ...commonCode.success,
        //   company
        // }
        return {
            ...commonCode.success,
            datas: {
                info: generateObj(company, [
                    'company_id',
                    'regionCompanies',
                    'name',
                    'business',
                    'companyClassName',
                    'confCompanyClass_id',
                    'entryTime',
                    'tags',
                    'qualificationInfo',
                    'confStateOccupancy_id',
                    'stateOccupancyName',
                    'contact',
                    'contactNumber',
                    'teamSize',
                    'address',
                    'remark',
                    'logo',
                    'hatchStatus',
                    /**新增字段 */
                    'contactEmail', //联系人邮箱
                    'safetyResponsiblePerson', // 安全责任人：
                    // 'corporateIdentityCard',  //法人身份证：
                    // 'corporateSex',  //法人性别: 1男， 2女
                    'fristRegisteredCapital', //*企业成立时注册资本(万元)
                    'industryType', //行业类别
                    'typesOfCorporateTaxpayers',
                    'registerType',
                    'floorSpace', //占用场地面积 （平方米）:

                    'responsiblePersonContactNumber', //责任人联系电话,
                    'teamType',
                    'lib',
                    'leaveTime',
                    'companyWechatPublicAccount',
                    'foreignInvestmentSource',
                    'scale',
                    'taxAuthority',
                    'wayOfTax',
                    'explanationIndustryUniversity',
                    'isExplanationUniversity'
                ]),
                industrialInfo: generateObj(company, [
                    'socialCreditCode',
                    'registeredCapital',
                    'legalRepresentative',
                    'establishmentDate',
                    'approvalDate',
                    'operationStatus',
                    'operationTermStart',
                    'operationTermEnd',
                    'registerInstitution',
                    'operationRange',
                    'registrationAddress',
                    'companyType'
                ]),
                companyProperty: generateObj(company, [
                    'companyFieldOfTechnology', // 技术领域:
                    'confFieldOfTechnology_id',
                    'isHeightCompany', //是否为高新企业:   "1、是  2、否"
                    'cognizanceTime', //认定时间
                    'isFirstCognizance', //是否首次认定 1是 2 否
                    // 'heightCopmanyFile', //高新企业材料, 文件ID
                    'isPublicCompany', // 是否为上市企业:    "1、是  2、否"
                    'publicCompanyType', //上市类型:  "1主板 2中小板 3创业板  4国外资本市场  5新三板  6并购"
                    'stockCode', //股票代码
                    'listTime', //上市时间
                    // 'publicCompanyFile', //上市企业证明材料 :
                    'isStart_upCompany', //是否为创业企业:  "1、是  2、否"
                    'start_upType', // 创业类型 :
                    'isMentors', //创业导师:  "1、是  2、否"
                    'isContinuity', //企业主要负责人是否为连续创业者: "1、是  2、否"
                    'AngelCapitalNum', // 获天使或风险投资额（千元）:

                    'isGraduate', //是否为毕业企业  "1、是  2、否"
                    'graduateTime', //毕业时间
                    'isBuildTutor', //是否与创业导师建立辅导关系 "1、是  2、否"
                    'principalSex', //主要负责人性别 "1、男  2、女"
                    'isCharacteristic',
                    'fieldOfTechnology',
                    'headName'
                ]),
                shareholderInfo: company.shareholderInfo,
                employeesInfo: company.employeesInfo,
                cooperativeCompany: company.cooperativeCompanies,
                heightCopmanyFile: heightCopmanyFiles,
                publicCompanyFile: publicCompanyFiles,
                companyNationISOes: company.companyNationISOs
            }
        }


    }
    async getRegionInfo(body) {
        let { regionCompany_id } = this.ctx.params
        let result = await this.app.curl('http://127.0.0.1:7005/api/admin/getybhelp', {
            method: 'GET',
            contentType: 'application/json',
            dataType: 'json'
        })
        // console.log(result.data.datas)
        // console.log(this.app.pgModel.Company.)
        if (!regionCompany_id) {
            return {
                ...commonCode.parameterError
            }
        }
        // regionCompany_id = regionCompany_id | 0
        let {
            Company,
            ConfStateOccupancy,
            ConfQualification,
            CompanyQualification,
            ConfCompanyInfoType,
            ConfCompanyClass,
            CompanyShareholders,
            CompanyEmployees,
            ConfTag,
            CooperativeCompany,
            ConfFieldOfTechnology,
            HeightCopmanyFile,
            PublicCompanyFile,
            File,
            CompanyNationISO,
            Region,
            RegionCompany,
            RegionHatchStatus,
            RegionContact,
            Recognition,
            CompanyFinancing,
            DataChange
        } = this.app.pgModel
        let regionCompany = await RegionCompany.findOne({
            where: {
                isValid: 1,
                regionCompany_id
            },
            include: [{
                model: RegionHatchStatus,
                where: {
                    isValid: 1
                },
                attributes: ['regionHatchStatus_id', 'name', 'status_id'],
                required: false
            }, {
                model: RegionContact,
                where: {
                    isValid: 1
                },
                attributes: ['name', 'tel', 'regionContact_id'],
                required: false
            }, {
                model: Region,
                where: {
                    isValid: 1
                },
                required: false
            }]
        })
        if (!regionCompany) return {
            ...commonCode.fail,
            msg: 'regionCompany_id不存在'
        }
        regionCompany = regionCompany.get({
            plain: true
        })
        let company_id = regionCompany.company_id
        let datachangeCount = await this.ctx.service.company.companyChangeCount({company_id})
        let year = new Date().getFullYear()
        let month = new Date().getMonth() + 1
        // await this.ctx.service.mark.updateMark({ regionCompany_id })
        let recognition = await Recognition.findAll({
            where: {
                isValid: 1,
                regionCompany_id,
                // year,
                // month
            },
            order:[['year','DESC'],['month','DESC']],
            attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] }
        })

        let company = await Company.findOne({
            where: {
                isValid: 1,
                company_id
            },
            attributes: {
                exclude: [
                    'isValid',
                    'createdAt',
                    'updatedAt',
                    'deletedAt',
                    'corporateIdentityCard',
                    'corporateSex'
                ]
            },
            include: [
                {
                    model: CompanyFinancing,
                    where: {
                        isValid: 1
                    },
                    attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                    required: false
                },
                {
                    model: ConfStateOccupancy,
                    where: {
                        isValid: 1
                    },
                    attributes: ['name'],
                    required: false
                },
                {
                    model: ConfCompanyClass,
                    where: {
                        isValid: 1
                    },
                    attributes: ['name'],
                    required: false
                },
                {
                    model: ConfTag,
                    where: {
                        isValid: 1
                    },
                    through: {
                        where: {
                            isValid: 1
                        }
                    },
                    required: false
                },
                {
                    model: ConfQualification,
                    where: {
                        isValid: 1
                    },
                    through: {
                        where: {
                            isValid: 1
                        }
                    },
                    required: false
                },
                {
                    model: ConfCompanyInfoType,
                    where: {
                        isValid: 1
                    },
                    through: {
                        where: {
                            isValid: 1
                        }
                    },
                    required: false
                },
                {
                    model: ConfFieldOfTechnology,
                    where: {
                        isValid: 1
                    },
                    required: false
                },
                {
                    model: CompanyEmployees,
                    where: {
                        isValid: 1
                    },
                    attributes: ['companyEmployees_id', 'name', 'position', 'company_id'],
                    required: false,
                    separate: true
                },
                {
                    model: CompanyShareholders,
                    where: {
                        isValid: 1
                    },
                    required: false,
                    attributes: [
                        'companyShareholders_id',
                        'name',
                        'holdingRate',
                        'investmentAmount',
                        'company_id',
                        'type'
                    ],
                    separate: true
                },
                {
                    model: CooperativeCompany,
                    where: {
                        isValid: 1
                    },
                    required: false,
                    attributes: ['cooperativeCompany_id', 'name', 'company_id'],
                    separate: true
                },
                {
                    model: HeightCopmanyFile,
                    where: {
                        isValid: 1
                    },
                    required: false,
                    attributes: ['heightCopmanyFile_id', 'file_id', 'company_id'],
                    separate: true,
                    include: [
                        {
                            model: File,
                            where: {
                                isValid: 1
                            },
                            attributes: ['file_id', 'type', 'fileName']
                        }
                    ]
                },
                {
                    model: PublicCompanyFile,
                    where: {
                        isValid: 1
                    },
                    required: false,
                    attributes: ['publicCompanyFile_id', 'company_id', 'file_id'],
                    separate: true,
                    include: [
                        {
                            model: File,
                            where: {
                                isValid: 1
                            },
                            attributes: ['file_id', 'type', 'fileName']
                        }
                    ]
                }, {
                    model: CompanyNationISO,
                    where: {
                        isValid: 1
                    },
                    required: false,
                    attributes: {
                        exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt']
                    },
                    separate: true
                }
            ]
        })
        if (!company) {
            return {
                ...commonCode.fail,
                msg: '企业不存在'
            }
        }
        company = company.get({
            plain: true
        })
        // console.log(company.companyNationISOs)
        company.shareholderInfo = []
        company.employeesInfo = []
        company.qualificationInfo = []
        company.tags = []
        for (const shareholder of company.companyShareholders) {
            company.shareholderInfo.push(shareholder)
        }
        for (const employee of company.companyEmployees) {
            company.employeesInfo.push(employee)
        }
        for (const {
            name,
            confQualification_id,
            companyQualification: { companyQualification_id }
        } of company.confQualifications) {
            company.qualificationInfo.push({
                name,
                confQualification_id,
                companyQualification_id
            })
        }
        for (const {
            name,
            confTag_id,
            companyConfTag: { companyConfTag_id }
        } of company.confTags) {
            company.tags.push({
                name,
                companyConfTag_id,
                confTag_id
            })
        }

        if (company.confCompanyClass) {
            company.companyClassName = company.confCompanyClass && company.confCompanyClass.name
        } else {
            company.confCompanyClass_id = null
        }
        if (company.confStateOccupancy) {
            company.stateOccupancyName =
                company.confStateOccupancy && company.confStateOccupancy.name
        } else {
            company.confStateOccupancy_id = null
        }
        if (company.confFieldOfTechnology) {
            company.companyFieldOfTechnology =
                company.confFieldOfTechnology && company.confFieldOfTechnology.name
        } else {
            company.confFieldOfTechnology_id = null
        }
        let heightCopmanyFiles = company.heightCopmanyFiles.map(v => {
            return {
                file_id: v.file_id,
                fileName: v.file.fileName,
                type: v.file.type,
                heightCopmanyFile_id: v.heightCopmanyFile_id
            }
        })
        let publicCompanyFiles = company.publicCompanyFiles.map(v => {
            return {
                file_id: v.file_id,
                fileName: v.file.fileName,
                type: v.file.type,
                publicCompanyFile_id: v.publicCompanyFile_id
            }
        })
        regionCompany.regionName = regionCompany.region && regionCompany.region.name
        // console.log(regionCompany)
        // return {
        //     ...commonCode.success,
        //     company
        // }
        return {
            ...commonCode.success,
            datas: {
                info: generateObj(company, [
                    'company_id',
                    'name',
                    'business',
                    'companyClassName',
                    'confCompanyClass_id',
                    'entryTime',
                    'tags',
                    'qualificationInfo',
                    'confStateOccupancy_id',
                    'stateOccupancyName',
                    'contact',
                    'contactNumber',
                    'teamSize',
                    'address',
                    'remark',
                    'logo',
                    'hatchStatus',
                    /**新增字段 */
                    'contactEmail', //联系人邮箱
                    'safetyResponsiblePerson', // 安全责任人：
                    // 'corporateIdentityCard',  //法人身份证：
                    // 'corporateSex',  //法人性别: 1男， 2女
                    'fristRegisteredCapital', //*企业成立时注册资本(万元)
                    'industryType', //行业类别
                    'typesOfCorporateTaxpayers',
                    'registerType',
                    'floorSpace', //占用场地面积 （平方米）:

                    'responsiblePersonContactNumber', //责任人联系电话,
                    'teamType',
                    'lib',
                    'leaveTime',
                    'companyWechatPublicAccount',
                    'foreignInvestmentSource',
                    'scale',
                    'taxAuthority',
                    'wayOfTax',
                    'contacts',
                    'explanationIndustryUniversity',
                    'isExplanationUniversity',
                    'cooperateOrganization',
                    'cooperateFiles'

                ]),
                industrialInfo: generateObj(company, [
                    'socialCreditCode',
                    'registeredCapital',
                    'legalRepresentative',
                    'establishmentDate',
                    'approvalDate',
                    'operationStatus',
                    'operationTermStart',
                    'operationTermEnd',
                    'registerInstitution',
                    'operationRange',
                    'registrationAddress',
                    'companyType'
                ]),
                companyProperty: generateObj(company, [
                    'companyFieldOfTechnology', // 技术领域:
                    'confFieldOfTechnology_id',
                    'isHeightCompany', //是否为高新企业:   "1、是  2、否"
                    'cognizanceTime', //认定时间
                    'isFirstCognizance', //是否首次认定 1是 2 否
                    // 'heightCopmanyFile', //高新企业材料, 文件ID
                    'isPublicCompany', // 是否为上市企业:    "1、是  2、否"
                    'publicCompanyType', //上市类型:  "1主板 2中小板 3创业板  4国外资本市场  5新三板  6并购"
                    'stockCode', //股票代码
                    'listTime', //上市时间
                    // 'publicCompanyFile', //上市企业证明材料 :
                    'isStart_upCompany', //是否为创业企业:  "1、是  2、否"
                    'start_upType', // 创业类型 :
                    'isMentors', //创业导师:  "1、是  2、否"
                    'isContinuity', //企业主要负责人是否为连续创业者: "1、是  2、否"
                    'AngelCapitalNum', // 获天使或风险投资额（千元）:

                    'isGraduate', //是否为毕业企业  "1、是  2、否"
                    'graduateTime', //毕业时间
                    'isBuildTutor', //是否与创业导师建立辅导关系 "1、是  2、否"
                    'principalSex', //主要负责人性别 "1、男  2、女"
                    'isCharacteristic',
                    'fieldOfTechnology',
                    'headName'
                ]),
                shareholderInfo: company.shareholderInfo,
                employeesInfo: company.employeesInfo,
                cooperativeCompany: company.cooperativeCompanies,
                heightCopmanyFile: heightCopmanyFiles,
                publicCompanyFile: publicCompanyFiles,
                companyNationISOes: company.companyNationISOs,
                ybhelp: result.data.datas,
                companyStatus: regionCompany.regionHatchStatuses,
                // contacts:regionCompany.regionContacts,
                // contacts:
                regionInfo: exclude(regionCompany, ['regionHatchStatuses', 'regionContacts', 'isValid', 'createdAt', 'updatedAt', 'deletedAt']),
                recognition,
                datachangeCount,
                companyFinace:company.companyFinancings
            }
        }
    }

    async processConfigDatas(body) {
        let { info, industrialInfo = {}, shareholderInfo = [], employeesInfo = [], companyProperty = {}, regionInfo = {} } = body
        // if (
        //     !Schema(body, [
        //         'info',
        //         'industrialInfo',
        //         'shareholderInfo',
        //         'employeesInfo',
        //         'companyProperty',
        //         // 'companyNationISOes'
        //     ])
        // ) {
        //     return {
        //         ...commonCode.parameterError
        //     }
        // }
        // await SchemaPromise(body,['info',
        //     // 'industrialInfo',
        //     // 'shareholderInfo',
        //     // 'employeesInfo',
        //     'companyProperty',
        // ])
        let { Op } = this.app.Sequelize
        await SchemaPromise(body, ['info'])
        let { tags, qualificationInfo, company_id } = info
        await SchemaPromise(info, ['tags', 'qualificationInfo', 'company_id'])
        // if (!Schema(info, ['tags', 'qualificationInfo', 'company_id'])) {
        //     return {
        //         ...commonCode.parameterError
        //     }
        // }

        let {
            Company,
            CompanyShareholders,
            CompanyEmployees,
            CompanyConfTag,
            CompanyQualification,
            CooperativeCompany,
            HeightCopmanyFile,
            PublicCompanyFile,
            CompanyNationISO,
            GxCommend,
            RegionCompany
        } = this.app.pgModel
        let company = {}
        let promiseArr = []
        let conf = [
            {
                model: CompanyShareholders,
                name: 'shareholderInfo',
                id: 'companyShareholders_id',
                add: ['name', 'holdingRate', 'investmentAmount', 'type'],
                update: ['name', 'holdingRate', 'investmentAmount', 'type'],
                del: ['companyShareholders_id']
            },
            {
                model: CompanyEmployees,
                name: 'employeesInfo',
                id: 'companyEmployees_id',
                del: ['companyEmployees_id'],
                update: ['name', 'position'],
                add: ['name', 'position']
            },
            {
                model: CooperativeCompany,
                name: 'cooperativeCompany',
                id: 'cooperativeCompany_id',
                del: ['cooperativeCompany_id'],
                update: ['name'],
                add: ['name']
            },
            {
                model: HeightCopmanyFile,
                name: 'heightCopmanyFile',
                id: 'heightCopmanyFile_id',
                del: ['heightCopmanyFile_id'],
                update: ['file_id'],
                add: ['file_id']
            },
            {
                model: PublicCompanyFile,
                name: 'publicCompanyFile',
                id: 'publicCompanyFile_id',
                del: ['publicCompanyFile_id'],
                update: ['file_id'],
                add: ['file_id']
            }, {
                model: CompanyNationISO,
                name: 'companyNationISOes',
                id: 'companyNationISO_id',
                del: ['companyNationISO_id'],
                update: ['isoName', 'isoLevel', 'isoNum', 'joinWay'],
                add: ['company_id', 'isoName', 'isoLevel', 'isoNum', 'joinWay']
            }, {
                model: RegionCompany,
                name: ''
            }
        ]
        let tagConf = [
            {
                model: CompanyConfTag,
                name: 'tags',
                id: 'companyConfTag_id',
                del: [],
                update: ['confTag_id'],
                add: ['confTag_id']
            },
            {
                model: CompanyQualification,
                name: 'qualificationInfo',
                id: 'companyQualification_id',
                del: [],
                update: ['confQualification_id'],
                add: ['confQualification_id']
            }  
        ]

        Object.assign(
            company,
            industrialInfo,
            exclude(info, ['tags']),
            generateObj(companyProperty, [
                'confFieldOfTechnology_id', // 技术领域:
                // 'isHeightCompany', //是否为高新企业:   "1、是  2、否"
                'cognizanceTime', //认定时间
                'isFirstCognizance', //是否首次认定 1是 2 否
                // 'heightCopmanyFile', //高新企业材料, 文件ID
                'isPublicCompany', // 是否为上市企业:    "1、是  2、否"
                'publicCompanyType', //上市类型:  "1主板 2中小板 3创业板  4国外资本市场  5新三板  6并购"
                'stockCode', //股票代码
                'listTime', //上市时间
                // 'publicCompanyFile', //上市企业证明材料 :
                'isStart_upCompany', //是否为创业企业:  "1、是  2、否"
                'start_upType', // 创业类型 :
                'isMentors', //创业导师:  "1、是  2、否"
                'isContinuity', //企业主要负责人是否为连续创业者: "1、是  2、否"
                'AngelCapitalNum', // 获天使或风险投资额（千元）:
                'isGraduate', //是否为毕业企业  "1、是  2、否"
                'graduateTime', //毕业时间
                'isBuildTutor', //是否与创业导师建立辅导关系 "1、是  2、否"
                'principalSex', //主要负责人性别 "1、男  2、女"
                'isCharacteristic',
                'fieldOfTechnology',
                'headName'
            ])
        )
        let originCompany = await Company.findOne({
            where: {
                company_id,
                isValid: 1
            }
        })
        if (originCompany.lib === 3 && originCompany.teamType === 1 && company.lib === 1 && regionInfo.regionCompany_id) {
            //离园改在园时默认企业未分区
            await RegionCompany.update({ region_id: -2 }, { where: { regionCompany_id: regionInfo.regionCompany_id } })//
            let count = await RegionCompany.count({ where: { region_id: { [Op.not]: false }, company_id, isValid: 1 } })
            if (!count) {
                company.isRegion = 0
            }
        }
        if (originCompany.teamType === 2 && company.teamType === 1) {
            //团队升级为企业,企业资质和企业类别删除
            await CompanyQualification.update(
                {
                    isValid: 0
                },
                {
                    where: {
                        isValid: 1,
                        company_id
                    }
                }
            )
            company.confCompanyClass_id = null
        }
        if (originCompany.lib === 1 && (company.lib !== 1) && company.hasOwnProperty('lib')) {
            let { park_id } = this.ctx
            await GxCommend.update({
                isValid: 0
            }, {
                where: {
                    isValid: 1,
                    company_id,
                    park_id
                }
            })
        }
        Object.assign(originCompany, company)
        await originCompany.save()
        promiseArr = [
            ...promiseArr,
            ...processConfig({
                conf,
                _id: { company_id },
                body
            }),
            ...processConfig({ conf: tagConf, _id: { company_id }, body: info })
        ]
        try {
            await Promise.all(promiseArr)
            let diff = await this.ctx.service.company.diffCompanyChange({
                type: 'businessFiles',
                company_id
            })
            return {
                ...commonCode.success,
                diff
            }
        } catch (err) {
            this.ctx.logger.error(err)
            return {
                ...commonCode.confError
            }
        }
    }
    async diffCompanyChange({ type, company_id }) {
        let {
            Company,
            CompanyBusinessFiles,
            CompanyFiles,
            ConfCompanyInfoType,
            File,
            AiRecognition
        } = this.app.pgModel
        let contrastKeys = {
            BusinessFiles: [
                'name',
                // 'business',
                'companyType',
                'address',
                'socialCreditCode',
                'registeredCapital',
                'legalRepresentative',
                'operationRange',
                'establishmentDate'
            ]
        }
        let diff = []
        if (type === 'businessFiles') {
            let changeFields = []
            let company = await Company.findOne({
                where: {
                    company_id,
                    isValid: 1
                },
                raw: true
            })
            let file = await CompanyFiles.findOne({
                where: {
                    isValid: 1,
                    company_id
                },
                attributes: ['url'],
                include: [
                    {
                        model: ConfCompanyInfoType,
                        where: {
                            isValid: 1,
                            name: '营业执照'
                        },
                        attributes: []
                    }
                ]
            })
            if (file) {
                let tranfromField = {
                    tranfromField: value => nzh.decode(value),
                    establishmentDate: value =>
                        value ? value.replace(/(年|月)/g, '-').replace(/(日|\s)/, '') : value
                }
                let tranfromOriginalField = {
                    companyType: value => CompanyType[value]
                }
                let aiRecognitions = await AiRecognition.findAll({
                    where: {
                        isValid: 1,
                        file_id: file.url,
                        isSure: 0
                    },
                    attributes: ['field', 'recogniteData', 'createdAt', 'aiRecognition_id'],
                    raw: true
                })
                changeFields = aiRecognitions
                    .map(({ field, recogniteData, createdAt, aiRecognition_id }) => ({
                        aiRecognition_id,
                        field,
                        oldValue: tranfromField[field]
                            ? tranfromField[field](recogniteData)
                            : recogniteData,
                        newValue: tranfromOriginalField[field]
                            ? tranfromOriginalField[field](company[field])
                            : company[field] === undefined
                                ? null
                                : company[field],
                        createdAt
                    }))
                    .filter(
                        v =>
                            v.oldValue !== v.newValue &&
                            contrastKeys.BusinessFiles.includes(v.field)
                    )
                console.log('aiRecognitions', aiRecognitions)
                console.log('changeFields', changeFields)
            }

            if (changeFields.length) {
                diff.push({
                    type: 'businessFiles',
                    changeFields
                })
            }
        }
        return diff
    }
    async getCompanyFilesList(body) {
        let { company_id } = body
        company_id = 0 | company_id
        if (!company_id) {
            return {
                ...commonCode.parameterError
            }
        }
        let { park_id } = this.ctx
        let { CompanyFiles, ConfCompanyInfoType, Company } = this.app.pgModel

        let [companyFiles, confCompanyInfoTypes] = await Promise.all([
            CompanyFiles.findAll({
                where: {
                    company_id,
                    isValid: 1
                },
                raw: true
            }),
            ConfCompanyInfoType.findAll({
                where: {
                    isValid: 1,
                    park_id
                },
                raw: true
            })
        ])
        /**
         * 查找关联表里没有的企业资料配置项
         * 如果有配置项没有就在关联表里插入
         */
        const notExistConfCompanyInfoTypes = confCompanyInfoTypes.filter(
            ({ confCompanyInfoType_id }) =>
                !companyFiles.find(v => v.confCompanyInfoType_id === confCompanyInfoType_id)
        )
        await CompanyFiles.bulkCreate(
            notExistConfCompanyInfoTypes.map(v => {
                return {
                    company_id,
                    confCompanyInfoType_id: v.confCompanyInfoType_id
                }
            })
        )
        let datas = await CompanyFiles.findAll({
            where: {
                company_id,
                isValid: 1
            },
            attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
            include: [
                {
                    model: ConfCompanyInfoType,
                    where: {
                        isValid: 1
                    },
                    attributes: ['name'],
                    required: true
                },
                {
                    model: Company,
                    where: {
                        isValid: 1
                    },
                    attributes: ['company_id'],
                    required: true
                }
            ]
        })
        datas = datas.map(v => {
            v = v.get({
                plain: true
            })
            v.name = v.confCompanyInfoType && v.confCompanyInfoType.name
            delete v.confCompanyInfoType
            return v
        })
        return {
            ...commonCode.success,
            datas
        }
    }
    /**
     * 企业资料只有更新url
     */
    async processCompanyFilesList(body) {
        let promiseArr = []
        if (!(body.datas && body.company_id && Array.isArray(body.datas))) {
            return {
                ...commonCode.parameterError
            }
        }
        let { company_id } = body
        let { park_id } = this.ctx
        let {
            CompanyFiles,
            ConfCompanyInfoType,
            File,
            CompanyBusinessFiles,
            AiRecognition
        } = this.app.pgModel
        let conf = [
            {
                model: CompanyFiles,
                name: 'datas',
                id: 'companyFiles_id',
                update: ['confCompanyInfoType_id', 'url'],
                del: [],
                add: ['confCompanyInfoType_id', 'url']
            }
        ]
        promiseArr = processConfig({ conf, _id: { company_id }, body })
        try {
            await Promise.all(promiseArr)
            let businessLicence = await ConfCompanyInfoType.findOne({
                where: {
                    isValid: 1,
                    name: '营业执照',
                    park_id
                },
                attributes: ['confCompanyInfoType_id']
            })
            for (const { flag, companyFiles_id, confCompanyInfoType_id, url } of body.datas) {
                if (
                    businessLicence &&
                    businessLicence.confCompanyInfoType_id === confCompanyInfoType_id
                ) {
                    if (flag === 'update') {
                        if (url) {
                            let file = await File.findOne({
                                where: {
                                    isValid: 1,
                                    file_id: url
                                },
                                attributes: ['sourcePath']
                            })
                            if (!file) {
                                this.logger.warn('营业执照文件不存在')
                            } else {
                                try {
                                    let isExist = await AiRecognition.findOne({
                                        where: {
                                            file_id: url,
                                            isValid: 1
                                        }
                                    })
                                    if (!isExist) {
                                        let { sourcePath: imagePath } = file
                                        // const AIurl = this.app.config.AIurl
                                        let result = await curlXfyun({
                                            curl: this.ctx.curl.bind(this.ctx),
                                            imagePath,
                                            prefix: this.ctx.app.config.prefix
                                        })

                                        let data = result.data.data

                                        let tranfromField = {
                                            address: 'address',
                                            company_name: 'name',
                                            company_type: 'companyType',
                                            // credit_code: 'socialCreditCode',
                                            operating_period:
                                                'biz_license_operating_period',
                                            owner: 'legalRepresentative',
                                            reg_capital: 'registeredCapital',
                                            reg_code: 'socialCreditCode',
                                            // reg_code:
                                            //     'biz_license_registration_code',
                                            license_scope: 'operationRange',
                                            start_time: 'establishmentDate'
                                        }
                                        console.log('data', data)
                                        console.log('result', result)
                                        if (data && result.data.code === 200) {
                                            await AiRecognition.bulkCreate(
                                                Object.keys(tranfromField).map(key => ({
                                                    file_id: url,
                                                    field: tranfromField[key],
                                                    recogniteData: data[key]
                                                }))
                                            )
                                            // let temp = {}
                                            // Object.entries(tranfromField).forEach(
                                            //     ([oldKey, newKey]) => {
                                            //         if (typeof newKey === 'object') {
                                            //             let format = newKey.format
                                            //             newKey = newKey.key
                                            //             temp[newKey] = format(data[oldKey])
                                            //         } else {
                                            //             temp[newKey] = data[oldKey]
                                            //         }
                                            //     }
                                            // )
                                            // await CompanyBusinessFiles.create(
                                            //     Object.assign(temp, {
                                            //         companyFiles_id,
                                            //         company_id
                                            //     })
                                            // )
                                        } else if (result.data.code === 203) {
                                            return {
                                                ...commonCode.success,
                                                code: 203,
                                                msg: '该营业执照无法识别，请重新上传'
                                            }
                                        }
                                    }

                                    let diff = await this.service.company.diffCompanyChange({
                                        type: 'businessFiles',
                                        company_id
                                    })
                                    return {
                                        ...commonCode.success,
                                        diff
                                    }
                                } catch (err) {
                                    this.ctx.logger.error(err)
                                    // this.ctx.logger.info(_result)
                                    this.ctx.logger.error('营业执照识别错误')
                                }
                            }
                        }
                    } else if (flag === 'delete') {
                        await CompanyBusinessFiles.update(
                            {
                                isValid: 0
                            },
                            {
                                where: {
                                    isValid: 1,
                                    companyFiles_id
                                }
                            }
                        )
                    }
                }
            }
            return {
                ...commonCode.success
            }
        } catch (err) {
            this.ctx.logger.error(err)
            console.log(err)
            return {
                ...commonCode.confError
            }
        }
    }
    async getCompanyIntelRight(body) {
        let { company_id } = body
        if (!company_id) {
            return {
                ...commonCode.parameterError
            }
        }
        let { CompanyIntelRight } = this.app.pgModel
        let datas = await CompanyIntelRight.findAll({
            where: {
                company_id,
                isValid: 1
            },
            attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
            order: [['year', 'DESC'], ['month', 'DESC']],
            raw: true
        })
        return {
            ...commonCode.success,
            datas
        }
    }
    async getCompanyIntelRightCount(body) {
        await SchemaPromise(body, ['company_id'])
        const { company_id, year, month } = body
        const {
            CompanyIntelRight,
            CompanyTrademark,
            WorksCopyright,
            SoftwareCopyright,
            Company,
            CompanyPatent
        } = this.app.pgModel
        CompanyIntelRight
        const { Op } = this.app.Sequelize
        if (!year && !month) {
            return {
                ...commonCode.fail,
                msg: '缺少年份和月份数据'
            }
        }
        // if(){

        // }
        let startTime, endTime, patentInventExpiresTime, patentOtherExpiresTime

        if (year && !month) {
            // startTime = `${year}-01-01`
            endTime = `${Number(year) + 1}-01-01`
            patentInventExpiresTime = `${year - 20}-01-01` //发明专利
            patentOtherExpiresTime = `${year - 10}-01-01` //实用新型专利和外观专利
        } else if (year && month) {
            // startTime = `${year}-01-01`
            // startTime=moment({ months: month - 1, years: year }).add(1, 'months').format()
            // endTime = `${Number(year) + 1}-01-01`
            endTime = moment({ months: month - 1, years: year }).add(1, 'months').format()
            // patentInventExpiresTime = `${year - 20}-01-01` //发明专利
            patentInventExpiresTime = moment({ months: month - 1, years: year - 20 }).add(1, 'months').format()
            patentOtherExpiresTime = moment({ months: month - 1, years: year - 10 }).add(1, 'months').format() //实用新型专利和外观专利
            // date_start = moment({ months: month - 1, years: year }).add(1, 'months').format()
            // console.log('date_start', date_start)
            // date_start=`${year}-${month.toString().padStart(2, 0)}-31 23:59:59`
            // date_start = `${year}-${month.toString().padStart(2, 0)}-31 23:59:59`
            // date_end = moment({ months: month - 1, years: year }).format()
        }

        let companyTrademark = {}
        let softwareCopyright = {}
        let worksCopyright = {}
        let companyPatent = {}
        let confs = [
            {
                model: CompanyTrademark,
                obj: companyTrademark,
                conditions: [
                    {
                        where: {
                            //商标有效数
                            liveTime_start: {
                                // [Op.gte]: startTime,
                                [Op.lt]: endTime
                            },
                            // liveTime_end: {
                            //     [Op.gte]: startTime
                            // }
                        },
                        field: 'effective'
                    },
                    {
                        where: {
                            //商标有效数
                            liveTime_start: {
                                // [Op.gte]: startTime,
                                [Op.lt]: endTime
                            },
                        },
                        field: 'count'
                    }
                ]
            },
            {
                model: SoftwareCopyright, //软件著作权
                obj: softwareCopyright,
                conditions: [
                    {
                        where: {
                            //软件著作权有效数
                            registerCompleteDate: {
                                // [Op.gte]: startTime,
                                [Op.lt]: endTime
                            }
                        },
                        field: 'effective'
                    }, {
                        where: {
                            registerCompleteDate: {
                                // [Op.gte]: startTime,
                                [Op.lt]: endTime
                            }
                        },
                        field: 'count'
                    }
                ]
            },
            {
                model: WorksCopyright, //作品著作权
                obj: worksCopyright,
                conditions: [

                    {
                        where: {
                            //作品著作权有效数
                            registerDate: {
                                // [Op.gte]: startTime,
                                [Op.lt]: endTime
                            }
                        },
                        field: 'effective'
                    },
                    {
                        where: {
                            registerDate: {
                                // [Op.gte]: startTime,
                                [Op.lt]: endTime
                            }
                        },
                        field: 'count'
                    }
                ]
            },
            {
                model: CompanyPatent,
                obj: companyPatent,
                conditions: [
                    {
                        where: {
                            //专利有效数
                            publishedAt: {
                                // [Op.gte]: startTime,
                                [Op.lt]: endTime
                            },
                            [Op.or]: [
                                {
                                    type: '发明专利',
                                    applicationDate: {
                                        [Op.gte]: patentInventExpiresTime
                                    }
                                },
                                {
                                    type: {
                                        [Op.or]: ['外观设计专利', '实用新型专利']
                                    },
                                    applicationDate: {
                                        [Op.gte]: patentOtherExpiresTime
                                    }
                                },
                                {
                                    type: {
                                        [Op.and]: [
                                            {
                                                [Op.not]: '外观设计专利'
                                            },
                                            {
                                                [Op.not]: '发明专利'
                                            },
                                            {
                                                [Op.not]: '实用新型专利'
                                            }
                                        ]
                                    }
                                }
                            ],
                            checkStatus: {
                                [Op.or]: ['有权-审定授权', '有权-部分有效']
                            }
                        },
                        field: 'effective'
                    }, {
                        where: {
                            publishedAt: {
                                // [Op.gte]: startTime,
                                [Op.lt]: endTime
                            },
                            checkStatus: {
                                [Op.or]: ['有权-审定授权', '有权-部分有效']
                            },
                            type: '外观设计专利',
                            applicationDate: {
                                [Op.gte]: patentOtherExpiresTime
                            }
                        },
                        field: 'industrialDesigns'
                    }, {
                        where: {
                            publishedAt: {
                                // [Op.gte]: startTime,
                                [Op.lt]: endTime
                            },
                            checkStatus: {
                                [Op.or]: ['有权-审定授权', '有权-部分有效']
                            },
                            type: '发明专利',
                            applicationDate: {
                                [Op.gte]: patentInventExpiresTime
                            }
                        },
                        field: 'invent'
                    }, {
                        where: {
                            publishedAt: {
                                // [Op.gte]: startTime,
                                [Op.lt]: endTime
                            },
                            checkStatus: {
                                [Op.or]: ['有权-审定授权', '有权-部分有效']
                            },
                            type: '实用新型专利',
                            applicationDate: {
                                [Op.gte]: patentOtherExpiresTime
                            }
                        },
                        field: 'utilityModel'
                    }
                ]
            }
        ]

        await Promise.all(
            confs.map(async ({ model, conditions, obj }) => {
                await Promise.all(
                    conditions.map(async ({ where, field }) => {
                        obj[field] = await model.count({
                            where: {
                                isValid: 1,
                                company_id,
                                ...where
                            }
                        })
                    })
                )
            })
        )
        // let companyTrademark = {}
        // let softwareCopyright = {}
        // let worksCopyright = {}
        // let companyPatent = {}
        /**
         * intelRightCount:只是产权总数
         * companyTrademark:商标
         * softwareCopyright:软件著作权
         * worksCopyright:作品著作权
         * industrialDesigns:外观设计专利
         * invent:发明专利
         * utilityModel:实用新型专利
         */
        return {
            ...commonCode.success,
            datas: {
                intelRightCount: [companyTrademark, softwareCopyright, worksCopyright, companyPatent].reduce((prev, cur) => prev + cur.effective, 0),
                companyTrademark: companyTrademark.count,
                softwareCopyright: softwareCopyright.count,
                worksCopyright: worksCopyright.count,
                // companyPatent:companyPatent.count,
                industrialDesigns: companyPatent.industrialDesigns,
                invent: companyPatent.invent,
                utilityModel: companyPatent.utilityModel
            }


        }
    }
    async processCompanyIntelRight(body) {
        await SchemaPromise(body, ['company_id', 'flag'])
        let { flag } = body

        let { CompanyIntelRight } = this.app.pgModel
        let datas = {
            datas: [body]
        }
        let promiseArr = []
        let conf = [
            {
                model: CompanyIntelRight,
                name: 'datas',
                id: 'companyIntelRight_id',
                add: [
                    'company_id',
                    'year',
                    'proprietary',
                    'invention',
                    'utility',
                    'appearance',
                    'PCT',
                    'trademark',
                    'copyright',
                    'ic',
                    'software',
                    'patentAppNum',
                    'inventionPatentApp',
                    'patentsAuthorizationNum',
                    'inventionPatentAuthorizationNum',
                    'buyForeignPatentNum',
                    'availableIntellectualNum',
                    'intellectualPatentNum',
                    'intellectualSoftware',
                    'intellectualNewVarietyPlant',
                    'intellectualIC',
                    'technicalContractNum',
                    'technicalContractToal',
                    'provincialAwards',
                    'intellectualApplyNum',
                    'intellectualAuthorizationNum',
                    'worksCopyright',
                    'softwareCopy',
                    'nationalPatent',
                    'nationalCropVariety',
                    'nationalNewDrug',
                    'nationalFirstclassProtection',
                    'designExclusiveRight'
                ],
                addFn: async (temp, _id) => {
                    if (!temp.year) {
                        return Promise.reject({
                            ...commonCode.parameterError
                        })
                    }
                    let [instance, created] = await CompanyIntelRight.findOrCreate({
                        where: {
                            year: temp.year,
                            isValid: 1,
                            company_id: temp.company_id,
                            month: temp.month ? parseInt(temp.month) : null,

                        },
                        attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                        defaults: {
                            ...temp,
                            ..._id
                        }
                    })
                    if (!created) {
                        return Promise.reject({
                            ...commonCode.fail,
                            msg: '年份已存在'
                        })
                    }
                    return instance.get({
                        plain: true
                    })
                },
                update: [
                    'year',
                    'proprietary',
                    'invention',
                    'utility',
                    'appearance',
                    'PCT',
                    'trademark',
                    'copyright',
                    'ic',
                    'software',
                    'patentAppNum',
                    'inventionPatentApp',
                    'patentsAuthorizationNum',
                    'inventionPatentAuthorizationNum',
                    'buyForeignPatentNum',
                    'availableIntellectualNum',
                    'intellectualPatentNum',
                    'intellectualSoftware',
                    'intellectualNewVarietyPlant',
                    'intellectualIC',
                    'technicalContractNum',
                    'technicalContractToal',
                    'provincialAwards',
                    'intellectualApplyNum',
                    'intellectualAuthorizationNum',
                    'worksCopyright',
                    'softwareCopy',
                    'nationalPatent',
                    'nationalCropVariety',
                    'nationalNewDrug',
                    'nationalFirstclassProtection',
                    'designExclusiveRight'
                ]
            }
        ]
        promiseArr = processConfig({ conf, _id: {}, body: datas })
        try {
            let [instance] = await Promise.all(promiseArr)
            if (flag === 'add') {
                return {
                    ...commonCode.success,
                    data: instance
                }
            }
            return {
                ...commonCode.success
            }
        } catch (err) {
            this.ctx.logger.error(err)
            if (err.code) {
                return {
                    ...err
                }
            }
            return {
                ...commonCode.confError
            }
        }
    }
    async getCompanyOperation(body) {
        let { company_id } = body
        if (!company_id) {
            return {
                ...commonCode.parameterError
            }
        }
        let { CompanyOperation, NationalProject } = this.app.pgModel
        let datas = await CompanyOperation.findAll({
            where: {
                company_id,
                isValid: 1
            },
            attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
            order: [['year', 'DESC'], ['month', 'DESC']],
            include: [
                {
                    model: NationalProject,
                    where: {
                        isValid: 1
                    },
                    attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                    required: false
                }
            ]
        })
        datas = datas.map(v =>
            v.get({
                plain: true
            })
        )
        return {
            ...commonCode.success,
            datas
        }
    }
    async processCompanyOperation(body) {
        await SchemaPromise(body, ['company_id', 'flag', 'year',])
        let { CompanyOperation, NationalProject = [] } = this.app.pgModel
        let datas = {
            datas: [body]
        }
        let { nationalProjects = [], flag } = body
        let promiseArr = []
        let conf = [
            {
                model: CompanyOperation,
                name: 'datas',
                id: 'companyOperation_id',
                add: [
                    'company_id',
                    'year',
                    'month',
                    'yearlyIncoming',
                    'netProfit',
                    'exportSum',
                    'yearlyRDFund',
                    'taxPayed',
                    'nationalRDProject',
                    'nationalRDFinancing',
                    'ProvinceRDProject',
                    'ProvinceRDFinancing',
                    'businessService',
                    'accountingService',
                    'financingService',
                    'hrService',
                    'projectApplicationService',
                    'smeConsultingService',
                    'publicTechnologyService',
                    'financeIntegrationService',
                    'lifeSupportingService',
                    'researchOrganization',
                    'TotalNumberAchievements',
                    'collegesNum',
                    'winningAchievements',
                    'outputResults',
                    'incubatorGDP',
                    'acceptPlanProject',
                    'nationalProject',
                    'scientificExpenditure',
                    'researchExpenditures',
                    'newProductExpenditure',
                    'governmentGrants',
                    'self_collected',
                    'writeUserName',
                    'contactNumber',
                    'companyPrincipal',
                    'statisticsPrincipal',
                    'co_pay',
                    'technologyContractCount',
                    'technologyContractSum',
                    'provinceAward'
                ],
                addFn: async (temp, _id) => {
                    if (!temp.year) {
                        return Promise.reject({
                            ...commonCode.parameterError
                        })
                    }
                    let [instance, created] = await CompanyOperation.findOrCreate({
                        where: {
                            year: temp.year,
                            isValid: 1,
                            company_id: temp.company_id,
                            month: temp.month ? parseInt(temp.month) : null,
                        },
                        attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                        defaults: {
                            ...temp,
                            ..._id
                        }
                    })
                    if (!created) {
                        return Promise.reject({
                            ...commonCode.fail,
                            msg: '年份已存在'
                        })
                    }
                    return instance.get({
                        plain: true
                    })
                },
                update: [
                    // 'company_id',
                    'year',
                    'month',
                    'yearlyIncoming',
                    'netProfit',
                    'exportSum',
                    'yearlyRDFund',
                    'taxPayed',
                    'nationalRDProject',
                    'nationalRDFinancing',
                    'ProvinceRDProject',
                    'ProvinceRDFinancing',
                    'businessService',
                    'accountingService',
                    'financingService',
                    'hrService',
                    'projectApplicationService',
                    'smeConsultingService',
                    'publicTechnologyService',
                    'financeIntegrationService',
                    'lifeSupportingService',
                    'researchOrganization',
                    'TotalNumberAchievements',
                    'collegesNum',
                    'winningAchievements',
                    'outputResults',
                    'incubatorGDP',
                    'acceptPlanProject',
                    'nationalProject',
                    'scientificExpenditure',
                    'researchExpenditures',
                    'newProductExpenditure',
                    'governmentGrants',
                    'self_collected',
                    'writeUserName',
                    'contactNumber',
                    'companyPrincipal',
                    'statisticsPrincipal',
                    'co_pay',
                    'technologyContractCount',
                    'technologyContractSum',
                    'provinceAward'
                ]
            }
        ]
        let instance
        try {
            [instance] = await Promise.all(processConfig({ conf, _id: {}, body: datas }))
        } catch (err) {
            this.ctx.logger.error(err)
            console.log(err)
            if (err.code) {
                return {
                    ...err
                }
            }
            return {
                ...commonCode.confError
            }
        }

        let companyOperation_id
        if (flag === 'add') {
            companyOperation_id = instance.companyOperation_id
        } else {
            companyOperation_id = body.companyOperation_id
        }
        if (!companyOperation_id) {
            return {
                ...commonCode.fail,
                msg: 'companyOperation_id字段缺失'
            }
        }
        let tagConf = [
            {
                model: NationalProject,
                name: 'nationalProjects',
                id: 'nationalProject_id',
                del: ['nationalProject_id'],
                update: ['name', 'type', 'aidingWays', 'aidingNum', 'itemLevel'],
                add: ['name', 'type', 'aidingWays', 'aidingNum', 'itemLevel']
            }
        ]
        let promiseArr2 = processConfig({ conf: tagConf, _id: { companyOperation_id }, body })
        await Promise.all(promiseArr2)
        // try {
        // await Promise.all([...promiseArr,...promiseArr2])

        return {
            ...commonCode.success
        }
        // } catch (err) {
        //     this.ctx.logger.error(err)
        //     console.log(err)
        //     if (err.code) {
        //         return {
        //             ...err
        //         }
        //     }
        //     return {
        //         ...commonCode.confError
        //     }
        // }
    }
    /**
     * 专利需要分页
     * @param {object} body
     * @property {string} pageSize
     * @property {string} page
     * @property {string} company_id
     * 搜索增加
     * publishedAt 公布日期
     * type 专利类型
     * checkStatus 法律状态
     */
    async getCompanyPatent(body) {
        await SchemaPromise(body, ['company_id', 'pageSize', 'page'])
        let { content, company_id, pageSize, page } = body
        pageSize = 0 | pageSize
        let { CompanyPatent: MODEL } = this.app.pgModel
        const { fn, col, Op } = this.app.Sequelize
        let where = {
            isValid: 1,
            company_id
        }
        if (content) {
            Object.assign(where, {
                [Op.or]: [
                    'name',
                    'publishApplicationNo',
                    'applicationNo',
                    'type',
                    'agent',
                    'abstract',
                    'applicant',
                    'checkStatus',
                    // 'accessory'
                ].map(key => {
                    return {
                        [key]: {
                            [Op.like]: `%${content}%`
                        }
                    }
                })
            })
        }
        if (
            !['publishedAt', 'type', 'checkStatus'].every(key => {
                if (body.hasOwnProperty(key) && (body[key] || body[key] === null)) {
                    if (key === 'publishedAt' && body[key]) {
                        let year = Number(body[key])
                        if (!(year >= 1960 && year <= 2050)) {
                            return false
                        }
                        let gtyear = `${year}-01-01`
                        let ltyear = `${year + 1}-01-01`
                        Object.assign(where, {
                            [key]: {
                                [Op.gte]: gtyear,
                                [Op.lt]: ltyear
                            }
                        })
                        return true
                    }
                    Object.assign(where, {
                        [key]: body[key]
                    })
                }
                return true
            })
        ) {
            return {
                ...commonCode.fail,
                msg: 'publishedAt字段格式有误'
            }
        }
        //SELECT year(createdAt),count(*) FROM xc_dev.companytrademark group by year(createdAt)
        let counts = await Promise.all(
            ['publishedAt', 'type', 'checkStatus'].map(key => {
                if (key === 'publishedAt') {
                    return MODEL.findAll({
                        where,
                        group: [fn('year', col(key))],
                        attributes: [[fn('year', col(key)), key], [fn('count', '*'), 'count']],
                        raw: true
                    })
                } else {
                    return MODEL.findAll({
                        where,
                        group: key,
                        attributes: [key, [fn('count', '*'), 'count']],
                        raw: true
                    })
                }
            })
        )

        let datas = await MODEL.findAll({
            where,
            offset: (page - 1) * pageSize,
            limit: pageSize,
            order: [['publishedAt', 'desc']],
            attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
            raw: true
        })
        return {
            ...commonCode.success,
            datas,
            counts
        }
    }
    async processCompanyPatent(body) {
        await SchemaPromise(body, ['company_id', 'flag'])
        let { CompanyPatent } = this.app.pgModel
        let datas = {
            datas: [body]
        }
        let promiseArr = []
        let conf = [
            {
                model: CompanyPatent,
                name: 'datas',
                id: 'companyPatent_id',
                add: [
                    'company_id',
                    'name',
                    'publishedAt',
                    'publishApplicationNo',
                    'applicationNo',
                    'applicationDate',
                    'type',
                    'agent',
                    'abstract',
                    'applicant',
                    'checkStatus',
                    'accessory'
                ],
                update: [
                    'name',
                    'publishedAt',
                    'publishApplicationNo',
                    'applicationNo',
                    'applicationDate',
                    'type',
                    'agent',
                    'abstract',
                    'applicant',
                    'checkStatus',
                    'accessory'
                ],
                del: []
            }
        ]
        promiseArr = processConfig({ conf, _id: {}, body: datas })
        try {
            let [datas] = await Promise.all(promiseArr)
            return {
                ...commonCode.success,
                datas
            }
        } catch (err) {
            this.ctx.logger.error(err)
            return {
                ...commonCode.confError
            }
        }
    }
    async searchCompanyNeedList(body) {
        let {
            company_id,
            pageSize = 5,
            page = 1,
            sortField,
            sortOrder,
            name,
            collectDate_start,
            collectDate_end,
            // type,
            keyword,
            status,
            username,
            companyName,
            confNeed_id
        } = body
        // await SchemaPromise(body, ['company_id'])
        let { CompanyNeed, User, Company } = this.app.pgModel
        let { literal, Op } = this.app.Sequelize
        const { park_id } = this.ctx
        let order = [[literal('collectDate is not null'), 'desc'], ['collectDate', 'desc']]
        if (sortField) {
            order = [[literal(`${sortField} is not null`), 'desc'], [sortField, sortOrder]]
        }
        let where = {
            isValid: 1
        }
        if (company_id) {
            where.company_id = company_id
        }
        if (name) {
            where.name = {
                [Op.like]: `%${name}%`
            }
        }
        if (confNeed_id) {
            where.confNeed_id = confNeed_id
        }
        if (keyword) {
            where.details = {
                [Op.like]: `%${keyword}%`
            }
        }
        if (status) {
            where.status = status
        }
        let include
        if (companyName) {
            include = [{
                model: Company,
                where: {
                    isValid: 1,
                    park_id,
                    name: { [Op.like]: `%${companyName}%` }
                },
                attributes: ['name']
            }]
        } else {
            include = [{
                model: Company,
                where: {
                    isValid: 1,
                    park_id
                },
                attributes: ['name']
            }]
        }

        if (username) {
            if ('系统生成'.includes(username)) {
                include.push(
                    {
                        model: User,
                        where: {
                            isValid: 1,
                            name: { [Op.like]: `%${username}%` }
                        },
                        required: false,
                        attributes: ['name']
                    }
                )
            } else {
                include.push(
                    {
                        model: User,
                        where: {
                            isValid: 1,
                            name: { [Op.like]: `%${username}%` }
                        },
                        required: true,
                        attributes: ['name']
                    }
                )
            }

        } else {
            include.push(
                {
                    model: User,
                    where: {
                        isValid: 1
                    },
                    required: false,
                    attributes: ['name']
                }
            )
        }
        if (collectDate_start || collectDate_end) {
            where.collectDate = {}
            if (collectDate_start) {
                where.collectDate[Op.gte] = collectDate_start
            }
            if (collectDate_end) {
                where.collectDate[Op.lte] = collectDate_end
            }
        }
        let options = {
            where,
            order,
            offset: (page - 1) * pageSize,
            limit: pageSize,
            attributes: { exclude: ['isValid', 'createdAt', 'deletedAt'] }
        }
        if (include) {
            options.include = include
        }
        let { count, rows: datas } = await CompanyNeed.findAndCountAll(options)
        datas = datas.map(v => {
            v = v.get({
                plain: true
            })
            v.createrName = v.user ? v.user.name : '系统生成'
            v.companyName = v.company.name
            return v
        })
        return {
            ...commonCode.success,
            datas,
            count
        }
    }
    async searchCompanyNeedDetail(body) {
        await SchemaPromise(body, ['companyNeed_id'])
        let { companyNeed_id } = body
        let { CompanyNeed, TalentRecruit, User, Company } = this.app.pgModel
        let companyNeed = await CompanyNeed.findOne({
            where: {
                companyNeed_id,
                isValid: 1
            },
            attributes: { exclude: ['isValid', 'createdAt', 'deletedAt'] },
            include: [
                {
                    model: TalentRecruit,
                    where: {
                        isValid: 1
                    },
                    required: false,
                    attributes: { exclude: ['isValid', 'createdAt', 'deletedAt'] }
                },
                {
                    model: User,
                    where: {
                        isValid: 1
                    },
                    required: false,
                    attributes: ['name']
                }, {
                    model: Company,
                    where: {
                        isValid: 1
                    },
                    attributes: ['name']
                }
            ]
        })
        if (!companyNeed) {
            return {
                ...commonCode.fail,
                msg: '企业需求不存在'
            }
        }
        companyNeed = companyNeed.get({
            plain: true
        })
        companyNeed.createrName = companyNeed.user ? companyNeed.user.name : '系统生成'
        companyNeed.companyName = companyNeed.company.name
        return {
            ...commonCode.success,
            datas: companyNeed
        }
    }
    async processCompanyNeedDetail(body) {
        await SchemaPromise(body, ['company_id', 'flag'])
        let { flag, companyNeed_id } = body
        body.creater = this.ctx.session.user.user_id
        let { CompanyNeed, TalentRecruit } = this.app.pgModel
        let datas = {
            datas: [body]
        }
        if (flag !== 'add' && !companyNeed_id) {
            return {
                ...commonCode.fail,
                msg: 'companyNeed_id缺失'
            }
        }
        if (!(body.needSource && Array.isArray(body.needSource))) {
            return {
                ...commonCode.fail,
                msg: 'needSource缺失或不为数组'
            }
        }
        let promiseArr = []
        let conf = [
            {
                model: CompanyNeed,
                name: 'datas',
                id: 'companyNeed_id',
                add: [
                    'company_id',
                    'collectDate',
                    'type',
                    'status',
                    'creater',
                    'details',
                    'contact',
                    'contactNumber',
                    'solutDate',
                    'solutionPerson',
                    'solution',
                    'confNeed_id'
                ],
                update: [
                    'collectDate',
                    'type',
                    'status',
                    'creater',
                    'details',
                    'contact',
                    'contactNumber',
                    'solutDate',
                    'solutionPerson',
                    'solution',
                    'confNeed_id'
                ],
                del: []
            }
        ]
        promiseArr = processConfig({ conf, _id: {}, body: datas })
        try {
            // await Promise.all(promiseArr)
            let [instance] = await Promise.all(promiseArr)
            // if (flag === 'add') {
            //     companyNeed_id = instance.companyNeed_id
            // }
            // let conf = [
            //     {
            //         model: NeedSource,
            //         name: 'needSource',
            //         id: 'needSource_id',
            //         add: [
            //             'pay',
            //             'experience',
            //             'education',
            //             'postDuties',
            //             'title',
            //             'publishDate',
            //             'infoSource',
            //             'url',
            //             'content'
            //         ],
            //         update: [
            //             'pay',
            //             'experience',
            //             'education',
            //             'postDuties',
            //             'title',
            //             'publishDate',
            //             'infoSource',
            //             'url',
            //             'content'
            //         ],
            //         del: []
            //     }
            // ]
            // let promiseSubArr = processConfig({ conf, _id: { companyNeed_id }, body })
            // await Promise.all(promiseSubArr)
            // if (flag === 'add') {
            //     return {
            //         ...commonCode.success,
            //         data: instance
            //             ? {
            //                 companyNeed_id: instance.companyNeed_id
            //             }
            //             : instance
            //     }
            // }
            return {
                ...commonCode.success,
                datas: instance
            }
        } catch (err) {
            this.ctx.logger.error(err)
            console.log(err)
            return {
                ...commonCode.confError
            }
        }
    }
    async processCompanyNeed(body) {
        await SchemaPromise(body, ['company_id', 'flag'])
        let { flag } = body
        let { CompanyNeed } = this.app.pgModel
        let datas = {
            datas: [body]
        }
        let promiseArr = []
        let conf = [
            {
                model: CompanyNeed,
                name: 'datas',
                id: 'companyNeed_id',
                add: [
                    'company_id',
                    'details',
                    'needDate',
                    'contactNumber',
                    'contact',
                    'serverDate',
                    'solution',
                    'confNeed_id'
                ],
                update: [
                    'details',
                    'needDate',
                    'contactNumber',
                    'contact',
                    'serverDate',
                    'solution',
                    'confNeed_id'
                ],
                del: []
            }
        ]
        promiseArr = processConfig({ conf, _id: {}, body: datas })
        try {
            // await Promise.all(promiseArr)
            let [instance] = await Promise.all(promiseArr)
            if (flag === 'add') {
                return {
                    ...commonCode.success,
                    data: instance
                        ? {
                            companyNeed_id: instance.companyNeed_id
                        }
                        : instance
                }
            }
            return {
                ...commonCode.success
            }
        } catch (err) {
            this.ctx.logger.error(err)
            console.log(err)
            return {
                ...commonCode.confError
            }
        }
    }
    async getCompanyFinancing(body) {
        let { company_id } = body
        if (!company_id) {
            return {
                ...commonCode.parameterError
            }
        }
        await SchemaPromise(body, ['company_id'])
        let { CompanyFinancing } = this.app.pgModel
        let datas = await CompanyFinancing.findAll({
            where: {
                company_id,
                isValid: 1
            },
            attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
            raw: true
        })
        return {
            ...commonCode.success,
            datas
        }
    }
    async processCompanyFinancing(body) {
        await SchemaPromise(body, ['company_id', 'flag'])
        let { flag } = body
        let { CompanyFinancing } = this.app.pgModel
        let datas = {
            datas: [body]
        }
        let promiseArr = []
        let conf = [
            {
                model: CompanyFinancing,
                name: 'datas',
                id: 'companyFinancing_id',
                add: [
                    'company_id',
                    'when',
                    'round',
                    'assessment',
                    'amount',
                    'ratio',
                    'investor',
                    'newsSource',
                    'typeOfInvestmentAndFinancing'
                ],
                update: [
                    'when',
                    'round',
                    'assessment',
                    'amount',
                    'ratio',
                    'investor',
                    'newsSource',
                    'typeOfInvestmentAndFinancing'
                ],
                del: []
            }
        ]
        promiseArr = processConfig({ conf, _id: {}, body: datas })
        try {
            let [instance] = await Promise.all(promiseArr)
            if (flag === 'add') {
                return {
                    ...commonCode.success,
                    datas: instance
                }
            }
            return {
                ...commonCode.success
            }
        } catch (err) {
            this.ctx.logger.error(err)
            return {
                ...commonCode.confError
            }
        }
    }
    async getTalentCounts(body){
        const {TalentConfPlan,Talent,CompanyTalentStat}=this.app.pgModel
        const {Op,col,fn}=this.app.Sequelize
        const {company_id}=body
        let talentConfPlans = await TalentConfPlan.findAll({
            where: {
                isValid: 1,
                joinDate:{
                    [Op.not]:null
                }
            },
            group:[ 'confTalentPlan_id',fn('year',col('joinDate')),fn('month',col('joinDate'))],
            raw: true,
            attributes: ['confTalentPlan_id', [fn('count', '*'), 'count'],[fn('year',col('joinDate')),'year'],[fn('month',col('joinDate')),'month']],
            include: [
                {
                    model: Talent,
                    where: {                                                                  
                        isValid: 1,
                        company_id
                    },
                    attributes: []
                }
            ]
        })
        let companyTalentStats=await CompanyTalentStat.findAll({
            where:{
                isValid:1,
                company_id
            }
        })
        return {
            ...commonCode.success,
            datas:{
                companyTalentStats,
                talentConfPlans,

            }
        }
    }
    async getCompanyTalentStat(body) {
        let { company_id } = body

        await this.ctx.service.python.countCompanyTalent({ company_id })
        if (!company_id) {
            return {
                ...commonCode.parameterError
            }
        }
        if (!this.ctx.session.user) {
            return {
                ...commonCode.unLogin
            }
        }
        let { park_id } = this.ctx.session.user
        if (!park_id) {
            return {
                ...commonCode.user.illegalVisitError
            }
        }

        let { CompanyTalentStat, ConfTalentPlan, CompanyTalentStatAndPlan } = this.app.pgModel
        let datas = await CompanyTalentStat.findAll({
            where: {
                company_id,
                isValid: 1
            },
            attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
            order: [['year', 'desc']],
            raw: true
        })
        let confTalentPlans = await ConfTalentPlan.findAll({
            where: {
                park_id,
                isValid: 1
            },
            include: [
                {
                    model: CompanyTalentStat,
                    where: {
                        isValid: 1,
                        company_id
                    },
                    required: false,
                    through: {
                        where: {
                            isValid: 1
                        }
                    }
                }
            ],
            attributes: ['name', 'confTalentPlan_id']
        })
        confTalentPlans = confTalentPlans.map(v => {
            return v.get({
                plain: true
            })
        })
        
       
        // console.log('talentConfPlans',talentConfPlans)
        for (const data of datas) {
            let { companyTalentStat_id } = data
            let talentPlan = []
            for (const plan of confTalentPlans) {
                let temp = filter(plan, ['name', 'confTalentPlan_id'])
                let companyTalentStat = plan.companyTalentStats.find(
                    v => v.companyTalentStatAndPlan.companyTalentStat_id === companyTalentStat_id
                )
                if (companyTalentStat) {
                    Object.assign(
                        temp,
                        filter(companyTalentStat.companyTalentStatAndPlan, [
                            'number',
                            'companyTalentStatAndPlan_id'
                        ])
                    )
                } else {
                    Object.assign(temp, {
                        number: null
                    })
                }
                talentPlan.push(temp)
            }
            data.talentPlan = talentPlan
        }
        return {
            ...commonCode.success,
            datas
        }
    }
    async processCompanyTalentStat(body) {
        await SchemaPromise(body, ['company_id', 'flag'])
        let { companyTalentStat_id, company_id, talentPlan = [] } = body
        let { CompanyTalentStat, CompanyTalentStatAndPlan } = this.app.pgModel
        let datas = {
            datas: [body]
        }
        let promiseArr = []
        let conf = [
            {
                model: CompanyTalentStat,
                name: 'datas',
                id: 'companyTalentStat_id',
                add: [
                    'company_id',
                    'year',
                    'month',
                    'total',
                    'rd',
                    'science',
                    'doctor',
                    'master',
                    'postgraduate',
                    'bachelor',
                    'overseas',
                    'college',
                    'secondary',
                    'internship',
                    'freshGraduate',
                    'research',
                    'foreignPersonnel',
                    'part_timeDutyPersonnel',
                    'temporaryStaff',
                    'seniorProfessionalTitle',
                    'mediumProfessionalTitle',
                    'primaryTitle',
                    'seniorTech',
                    'tech30',
                    'tech40',
                    'tech50',
                    'tech60'
                ],
                addFn: async (temp, _id) => {
                    if (!temp.year) {
                        return Promise.reject({
                            ...commonCode.parameterError
                        })
                    }
                    let [instance, created] = await CompanyTalentStat.findOrCreate({
                        where: {
                            year: temp.year,
                            month: temp.month,
                            isValid: 1,
                            company_id: temp.company_id
                        },
                        attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                        defaults: {
                            ...temp,
                            ..._id
                        }
                    })
                    if (!created) {
                        return Promise.reject({
                            ...commonCode.fail,
                            msg: '年份已存在'
                        })
                    }
                    companyTalentStat_id = instance.companyTalentStat_id
                    return instance.get({
                        plain: true
                    })
                },
                update: [
                    'year',
                    'total',
                    'rd',
                    'science',
                    'doctor',
                    'master',
                    'postgraduate',
                    'bachelor',
                    'overseas',
                    'college',
                    'secondary',
                    'internship',
                    'freshGraduate',
                    'research',
                    'foreignPersonnel',
                    'part_timeDutyPersonnel',
                    'temporaryStaff',
                    'seniorProfessionalTitle',
                    'mediumProfessionalTitle',
                    'primaryTitle',
                    'seniorTech',
                    'tech30',
                    'tech40',
                    'tech50',
                    'tech60'
                ],
                del: []
            }
        ]
        promiseArr = processConfig({ conf, _id: {}, body: datas })
        try {
            let [datas] = await Promise.all(promiseArr)
            for (const plan of talentPlan) {
                let { name, number, companyTalentStatAndPlan_id, confTalentPlan_id } = plan
                if (companyTalentStatAndPlan_id) {
                    let companyTalentStatAndPlan = await CompanyTalentStatAndPlan.findOne({
                        where: {
                            isValid: 1,
                            companyTalentStatAndPlan_id
                        }
                    })
                    if (!companyTalentStatAndPlan) {
                        return {
                            ...commonCode.fail,
                            msg: '人才计划不存在'
                        }
                    }
                    Object.assign(companyTalentStatAndPlan, filter(plan, ['number']))
                    await companyTalentStatAndPlan.save()
                } else {
                    if (!companyTalentStat_id || !confTalentPlan_id) {
                        return {
                            ...commonCode.parameterError
                        }
                    }
                    let [instance, created] = await CompanyTalentStatAndPlan.findOrCreate({
                        where: {
                            companyTalentStat_id,
                            confTalentPlan_id,
                            isValid: 1
                        },
                        defaults: {
                            companyTalentStat_id,
                            confTalentPlan_id,
                            number
                        }
                    })
                    if (!created) {
                        return {
                            ...commonCode.fail,
                            msg: '人才计划统计已存在'
                        }
                    }
                }
            }
            return {
                ...commonCode.success,
                datas
            }
        } catch (err) {
            this.ctx.logger.error(err)
            if (err.msg) {
                return err
            } else {
                return {
                    ...commonCode.confError
                }

            }
        }
    }
    async getCompanyNewsList(body) {
        let { company_id } = body
        if (!company_id) {
            return {
                ...commonCode.parameterError
            }
        }
        let { CompanyNews } = this.app.pgModel
        let datas = await CompanyNews.findAll({
            where: {
                company_id,
                isValid: 1,
                issueStatus: 1,
                auditingStatus: 1
            },
            order: [['issueDate', 'DESC']],
            limit: 3,
            attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
            raw: true
        })
        return {
            ...commonCode.success,
            datas
        }
    }
    async addCompanyNews(body) {
        if (!Schema(body, ['title', 'company_id', 'url', 'details', 'tags', 'summary'])) {
            return {
                ...commonCode.parameterError
            }
        }
        let { CompanyNews } = this.app.pgModel
        let instance = filter(body, ['title', 'company_id', 'url', 'details', 'tags', 'summary'])
        instance = await CompanyNews.create(instance)
        return {
            ...commonCode.success,
            datas: { companyNews_id: instance.companyNews_id }
        }
    }
    async getCompanyNews(body) {
        let { companyNews_id } = body
        if (!Schema(body, ['companyNews_id'])) {
            return {
                ...commonCode.parameterError
            }
        }
        let { CompanyNews } = this.app.pgModel
        let instance = await CompanyNews.findOne({
            where: {
                companyNews_id,
                isValid: 1,
                auditingStatus: 1
            },
            attributes: ['title', 'company_id', 'url', 'details', 'tags']
        })
        if (!instance) {
            return {
                ...commonCode.fail,
                msg: '新闻不存在'
            }
        }
        return {
            ...commonCode.success,
            datas: instance
        }
    }
    async updateCompanyNews(body) {
        let { companyNews_id } = body
        if (!Schema(body, ['companyNews_id'])) {
            return {
                ...commonCode.parameterError
            }
        }
        let { CompanyNews } = this.app.pgModel
        let companyNews = await CompanyNews.findOne({
            where: {
                companyNews_id,
                isValid: 1,
                auditingStatus: 1
            }
        })
        if (!companyNews) {
            return {
                ...commonCode.fail,
                msg: '新闻不存在'
            }
        }
        Object.assign(companyNews, filter(body, ['title', 'details', 'tags', 'issueDate', 'url']))
        if (body.issueStatus === 1) {
            companyNews.issueStatus = 1
            companyNews.issueDate = Date.now()
        }
        await companyNews.save()
        return {
            ...commonCode.success
        }
    }
    async getCompanyMap(body) {
        let { company_id } = body

        if (!Schema(body, ['company_id'])) {
            return {
                ...commonCode.parameterError
            }
        }
        let {
            Company,
            Park,
            Product,
            CooperativeCompany,
            CompanyShareholders,
            CompanyPatent,
            CompanyNews
        } = this.app.pgModel
        let company = await Company.findOne({
            where: {
                isValid: 1,
                company_id,
                teamType: 1
            },
            include: [
                {
                    model: CompanyShareholders,
                    where: {
                        isValid: 1
                    },
                    attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                    required: false,
                    separate: true
                },
                {
                    model: CompanyPatent,
                    where: {
                        isValid: 1
                    },
                    attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                    separate: true,
                    required: false
                },
                {
                    model: CompanyNews,
                    where: {
                        isValid: 1,
                        issueStatus: 1,
                        auditingStatus: 1
                    },
                    attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
                    separate: true,
                    required: false
                },
                {
                    model: CooperativeCompany,
                    where: {
                        isValid: 1
                    },
                    attributes: ['name', 'cooperativeCompany_id', 'company_id'],
                    separate: true,
                    required: false
                },
                {
                    model: Product,
                    where: {
                        isValid: 1
                    },
                    attributes: ['name', 'product_id', 'company_id', 'details'],
                    separate: true,
                    required: false
                },
                {
                    model: Park,
                    where: {
                        isValid: 1
                    },
                    attributes: ['name', 'park_id'],
                    required: true
                }
            ]
        })
        if (!company) {
            return {
                ...commonCode.fail,
                msg: '公司不存在'
            }
        }

        company = company.get({
            plain: true
        })
        let joinCompany = []
        let companyProduct = []
        /**
         *临时演示需求增加假数据
        武汉精匠科技有限公司
        `{
        joinCompany: [{
        name: '武汉精烽电子技术有限公司',
        // profile:"",
        company_id: 1
        }, {
        name: "武汉华工图像技术开发有限公司",
        company_id: 2
        }],
        companyProduct: [{
            name: '全息水转印',
            description: '全息水转印电化铝是电化铝的一种类型，与印刷相结合后形成全息水转印花纸，通过水转印工艺可将花纸粘贴在不规则的玻璃或陶瓷制品（如酒瓶、化妆品瓶）等表面上。 目前，国内90%的酒瓶包装使用的均是普通的水转印材料，包装整体视觉单一，且极易被仿制。我司独家开发的定位全息水转印花纸，成功将全息技术与水转印技术结合，实现了低温全息花纸的产业化，能够提升包装档次，提升品牌价值，防止假冒伪劣。',
            companyProduct_id: 1
        }]
        }
        武汉精烽电子技术有限公司
        {
        joinCompany: [{
        name: '武汉亿力电子科技有限公司',
        // profile:"",
        company_id: 3
        }, {
        name: "武汉明意数字科技有限责任公司",
        company_id: 4
        }],
        companyProduct: [{
            name: '锐诺斯V4-675写真机',
            description: '高速压电写真机V4-675 USB3.0颠覆数据传输极限，直击工业4.0 全天全自动稳定打印； 双卷同时喷印，相当于两台单头写真机同时工作，高速高效！ 2880dpi高精度喷绘，完美还原真实色彩。 全系统自我研发，稳定高效；王牌售后，更省心更可靠！ 国产喷绘写真设备皇者机型--锐诺斯V4-675！',
            companyProduct_id: 2
        }]
        }`
         */
        if (company.name === '武汉精匠科技有限公司') {
            joinCompany = [
                ...joinCompany,
                {
                    name: '武汉精烽电子技术有限公司',
                    company_id: 1
                },
                {
                    name: '武汉华工图像技术开发有限公司',
                    company_id: 2
                }
            ]
            companyProduct = [
                ...companyProduct,
                {
                    name: '全息水转印',
                    description:
                        '全息水转印电化铝是电化铝的一种类型，与印刷相结合后形成全息水转印花纸，通过水转印工艺可将花纸粘贴在不规则的玻璃或陶瓷制品（如酒瓶、化妆品瓶）等表面上。 目前，国内90%的酒瓶包装使用的均是普通的水转印材料，包装整体视觉单一，且极易被仿制。我司独家开发的定位全息水转印花纸，成功将全息技术与水转印技术结合，实现了低温全息花纸的产业化，能够提升包装档次，提升品牌价值，防止假冒伪劣。',
                    companyProduct_id: 1
                }
            ]
        } else if (company.name === '武汉精烽电子技术有限公司') {
            joinCompany = [
                ...joinCompany,
                {
                    name: '武汉亿力电子科技有限公司',
                    company_id: 3
                },
                {
                    name: '武汉明意数字科技有限责任公司',
                    company_id: 4
                }
            ]
            companyProduct = [
                ...companyProduct,
                {
                    name: '锐诺斯V4-675写真机',
                    description:
                        '高速压电写真机V4-675 USB3.0颠覆数据传输极限，直击工业4.0 全天全自动稳定打印； 双卷同时喷印，相当于两台单头写真机同时工作，高速高效！ 2880dpi高精度喷绘，完美还原真实色彩。 全系统自我研发，稳定高效；王牌售后，更省心更可靠！ 国产喷绘写真设备皇者机型--锐诺斯V4-675！',
                    companyProduct_id: 2
                }
            ]
        }
        if (company)
            return {
                ...commonCode.success,
                datas: {
                    parkInfo: generateObj(company.park, ['park_id', 'name']),
                    baseInfo: generateObj(company, [
                        'company_id',
                        'name',
                        'business',
                        'entryTime',
                        'contact',
                        'contactNumber',
                        'teamSize',
                        'address',
                        'remark',
                        'socialCreditCode',
                        'registeredCapital',
                        'legalRepresentative',
                        'establishmentDate',
                        'approvalDate',
                        'operationStatus',
                        'operationTermStart',
                        'operationTermEnd',
                        'registerInstitution',
                        'operationRange',
                        'registrationAddress',
                        'companyType'
                    ]),
                    shareholders: company.companyShareholders,
                    patent: company.companyPatents,
                    news: company.companyNews,
                    joinCompany: company.cooperativeCompanies,
                    companyProduct: company.products
                }
            }
    }
    async getParkCompanyPrintList(body) {
        let { park_id } = this.ctx
        let { teamType = 1, lib,region_id } = body
        if (teamType == 2) {
            lib = 2
        } else {
            if (!lib) {
                lib = 1
            }
        }
        let { ConfCompanyInfoType,RegionCompany, Company, CompanyFiles, CompanyStore } = this.app.pgModel
        let confCompanyInfoTypes = await ConfCompanyInfoType.findAll({
            where: {
                isValid: 1,
                park_id
            },
            attributes: ['confCompanyInfoType_id', 'name'],
            raw: true
        })
        let { user_id } = this.ctx.session.user
        let include = [
            {
                model: CompanyFiles,
                where: {
                    isValid: 1
                },
                as: 'files',
                include: [
                    {
                        model: ConfCompanyInfoType,
                        where: {
                            isValid: 1
                        }
                    }
                ],
                required: false
            }
        ]
        //表示获取收藏企业打印资料
        if (body.hasOwnProperty('store')) {
            include.push({
                model: CompanyStore,
                where: {
                    isValid: 1,
                    user_id
                }
            })
        }
        if(region_id&&region_id!='-1'){
            include.push({
                model: RegionCompany,
                where: {
                    isValid: 1,
                    region_id
                }
            })
        }
        let companies = await Company.findAll({
            where: {
                isValid: 1,
                park_id,
                teamType,
                lib
            },
            attributes: ['company_id', 'name'],
            include
        })
        let list = companies.map(v => {
            v = v.get({
                plain: true
            })
            let temp = {}
            Object.assign(temp, filter(v, ['company_id', 'name']))
            temp.filesList = v.files.map(file => {
                return {
                    companyFiles_id: file.companyFiles_id,
                    name: file.confCompanyInfoType.name,
                    url: file.url,
                    confCompanyInfoType_id: file.confCompanyInfoType_id
                }
            })

            return temp
        })
        return {
            ...commonCode.success,
            datas: {
                confInfo: confCompanyInfoTypes,
                list
            }
        }
    }
    async searchCompanyChange(body) {
        await SchemaPromise(body, ['company_id'])
        let { Company, CompanyShareholders, CompanyEmployees, DataChange } = this.app.pgModel
        const { company_id } = body
        const { Sequelize } = this.app
        const { Op, literal } = Sequelize
        let tables = await DataChange.findAll({
            where: {
                isValid: 1,
                flag: 1
            },
            attributes: ['table'],
            group: ['table'],
            distinct: true,
            raw: true
        })
        /**
         * @constant {Regexp} extraTables 这两个表source_id为company_id
         */
        const extraTables = /^(companyEmployees|companyShareholders)$/i

        let datas = await Promise.all(
            tables.map(async ({ table }) => {
                if (extraTables.test(table)) {
                    return await this.app.pgModel.query(
                        `(select * from dataChange where flag=1 and isValid=1 and dataChange.table='${table}'
                        and log_id=(select  log_id  from dataChange  as a where a.table='${table}' and  isValid =1 and flag =1 and a.source_id=${company_id}  order by a.createdAt desc limit 1)
                            and dataChange.source_id=${company_id})`,
                        { type: Sequelize.QueryTypes.SELECT }
                    )
                } else {
                    return await this.app.pgModel.query(
                        `(select * from dataChange where flag=1 and isValid=1 and dataChange.table='${table}'
                        and log_id=(select  log_id  from dataChange  as a where a.table='${table}' and  isValid =1 and flag =1 and (select company_id from ${table} where ${table +
                        '_id'}=a.source_id and isValid=1)=${company_id}  order by a.createdAt desc limit 1)
                            and (select company_id from ${table} where ${table +
                        '_id'}=dataChange.source_id and isValid=1)=${company_id})`,
                        { type: Sequelize.QueryTypes.SELECT }
                    )
                }
            })
        )
        let result = []
        for (const data of datas) {
            result = [...result, ...data]
        }
        return {
            ...commonCode.success,
            datas: result
        }
    }
    async companyChangeCount(body){
        await SchemaPromise(body, ['company_id'])
        let { Company, CompanyShareholders, CompanyEmployees, DataChange } = this.app.pgModel
        const { company_id } = body
        const { Sequelize } = this.app
        const { Op, literal } = Sequelize
        let tables = await DataChange.findAll({
            where: {
                isValid: 1,
                flag: 1
            },
            attributes: ['table'],
            group: ['table'],
            distinct: true,
            raw: true
        })
        /**
         * @constant {Regexp} extraTables 这两个表source_id为company_id
         */
        const extraTables = /^(companyEmployees|companyShareholders)$/i

        let datas = await Promise.all(
            tables.map(async ({ table }) => {
                if (extraTables.test(table)) {
                    return await this.app.pgModel.query(
                        `(select count(*) as count  from dataChange where flag=1 and isValid=1 and dataChange.table='${table}'
                        and log_id=(select  log_id  from dataChange  as a where a.table='${table}' and  isValid =1 and flag =1 and a.source_id=${company_id}  order by a.createdAt desc limit 1)
                            and dataChange.source_id=${company_id})`,
                        { type: Sequelize.QueryTypes.SELECT }
                    )
                } else {
                    return await this.app.pgModel.query(
                        `(select count(*) as count from dataChange where flag=1 and isValid=1 and dataChange.table='${table}'
                        and log_id=(select  log_id  from dataChange  as a where a.table='${table}' and  isValid =1 and flag =1 and (select company_id from ${table} where ${table +
                        '_id'}=a.source_id and isValid=1)=${company_id}  order by a.createdAt desc limit 1)
                            and (select company_id from ${table} where ${table +
                        '_id'}=dataChange.source_id and isValid=1)=${company_id})`,
                        { type: Sequelize.QueryTypes.SELECT }
                    )
                }
            })
        )
        console.log(datas)
        // let result = []
        let count=0
        for (const data of datas) {
            count+=data[0].count
        }
        return count
    }
    async sureOneChange(body) {
        await SchemaPromise(body, ['dataChange_id', 'flag'])
        const { dataChange_id, flag } = body
        const { DataChange, Company } = this.app.pgModel
        const { Sequelize, pgModel } = this.app
        const extraTables = /^(companyEmployees|companyShareholders)$/i
        let instance = await DataChange.findOne({
            where: {
                isValid: 1,
                dataChange_id,
                flag: 1
            },
            raw: true
        })
        if (!instance) {
            return {
                ...commonCode.fail,
                msg: '数据不存在或已确认'
            }
        }
        const { log_id, table, source_id } = instance
        const _table = table.replace(/^[\s\S]/, v => v.toUpperCase())
        const model = pgModel[_table]
        let company_id
        /**
         * 首先判断这个企业是否存在，并查询企业id
         */
        if (extraTables.test(table)) {
            company_id = source_id
        } else {
            let instance2 = await model.findOne({
                where: {
                    isValid: 1,
                    [`${table}_id`]: source_id
                },
                attributes: ['company_id'],
                raw: true
            })
            if (!instance2)
                return {
                    ...commonCode.fail,
                    msg: '公司不存在'
                }
            company_id = instance2.company_id
        }

        let error = null
        try {
            await confirm({ instances: instance, DataChange, pgModel, flag })
        } catch (err) {
            this.ctx.logger.error(err)
            error = err
        }
        /**
         * @constant {Regexp} extraTables 这两个表source_id为company_id
         */

        let selectCompany_id
        let aliasSelectCompany_id
        if (extraTables.test(table)) {
            selectCompany_id = 'dataChange.source_id'
            aliasSelectCompany_id = 'a.source_id'
        } else {
            selectCompany_id = `(select company_id from ${table} where ${table +
                '_id'}=dataChange.source_id and isValid=1 )`
            aliasSelectCompany_id = `(select company_id from ${table} where ${table +
                '_id'}=a.source_id and isValid=1 )`
        }
        /**
         * 同一公司，批次下，同一个table，如果数据确认完了，删除老数据
         */

        let isEmpty = await this.app.pgModel.query(
            `select * from dataChange
            where flag=1
                and isValid=1
                and dataChange.table='${table}'
                and log_id='${log_id}'
                and ${company_id}= ${selectCompany_id}
            limit 1`,
            { type: Sequelize.QueryTypes.SELECT }
        )
        if (!isEmpty.length) {
            await this.app.pgModel.query(
                `update dataChange
                set isValid=0
                where dataChange.table='${table}'
                    and log_id<>'${log_id}'
                    and ${company_id}= ${selectCompany_id}
                `,
                { type: Sequelize.QueryTypes.UPDATE }
            )
        }
        /**
         * 同一公司，如果数据确认完了修改company下的changeFlag改为0
         *
         */
        let tables = await DataChange.findAll({
            where: {
                isValid: 1,
                flag: 1
            },
            attributes: ['table'],
            group: ['table'],
            distinct: true,
            raw: true
        })
        let datas = await Promise.all(
            tables.map(async ({ table }) => {
                if (extraTables.test(table)) {
                    selectCompany_id = 'dataChange.source_id'
                    aliasSelectCompany_id = 'a.source_id'
                } else {
                    selectCompany_id = `(select company_id from ${table} where ${table +
                        '_id'}=dataChange.source_id and isValid=1 )`
                    aliasSelectCompany_id = `(select company_id from ${table} where ${table +
                        '_id'}=a.source_id and isValid=1 )`
                }
                return await this.app.pgModel.query(
                    `(select * from dataChange where flag=1 and isValid=1 and dataChange.table='${table}'
                    and log_id=(select  log_id  from dataChange  as a where a.table='${table}' and  isValid =1 and flag =1 and ${aliasSelectCompany_id}=${company_id}  order by a.createdAt desc limit 1)
                        and ${selectCompany_id}=${company_id})`,
                    { type: Sequelize.QueryTypes.SELECT }
                )
            })
        )
        let result = []
        for (const data of datas) {
            result = [...result, ...data]
        }
        if (!result.length) {
            await Company.update(
                {
                    changeFlag: 0,
                    changTime: null
                },
                {
                    where: {
                        isValid: 1,
                        company_id
                    }
                }
            )
        }
        const changeTable = /company/i
        let diff = []
        if (changeTable.test(table)) {
            diff = await this.ctx.service.company.diffCompanyChange({
                type: 'businessFiles',
                company_id
            })
        }
        return error
            ? {
                ...commonCode.confError,
                msg: '字段更新有误'
            }
            : {
                ...commonCode.success,
                diff
            }
    }
    async sureAllChange(body) {
        await SchemaPromise(body, ['log_id', 'table', 'company_id'])
        const { log_id, table, company_id } = body
        const { DataChange, Company } = this.app.pgModel
        const { Sequelize, pgModel } = this.app
        /**
         * @constant {Regexp} extraTables 这两个表source_id为company_id
         */
        const extraTables = /^(companyEmployees|companyShareholders)$/i
        let selectCompany_id
        let aliasSelectCompany_id
        if (extraTables.test(table)) {
            selectCompany_id = 'dataChange.source_id'
            aliasSelectCompany_id = 'a.source_id'
        } else {
            selectCompany_id = `(select company_id from ${table} where ${table +
                '_id'}=dataChange.source_id and isValid=1 )`
            aliasSelectCompany_id = `(select company_id from ${table} where ${table +
                '_id'}=a.source_id and isValid=1 )`
        }
        const instances = await this.app.pgModel.query(
            `(
            select * from dataChange
            where flag=1
                and isValid=1
                and dataChange.table='${table}'
                and log_id='${log_id}'
                and ${selectCompany_id}=${company_id})`,
            { type: Sequelize.QueryTypes.SELECT }
        )
        let error = null
        try {
            await confirm({ instances, DataChange, pgModel, flag: 2 })
        } catch (err) {
            this.ctx.logger.error(err)
            error = err
        }

        /**
         * 同一公司，批次下，如果数据确认完了，删除老数据
         */
        await this.app.pgModel.query(
            `update dataChange
            set isValid=0
            where dataChange.table='${table}'
                and log_id<>'${log_id}'
                and ${selectCompany_id}=${company_id}
            `,
            { type: Sequelize.QueryTypes.UPDATE }
        )
        let tables = await DataChange.findAll({
            where: {
                isValid: 1,
                flag: 1
            },
            attributes: ['table'],
            group: ['table'],
            distinct: true,
            raw: true
        })
        let datas = await Promise.all(
            tables.map(async ({ table }) => {
                if (extraTables.test(table)) {
                    selectCompany_id = 'dataChange.source_id'
                    aliasSelectCompany_id = 'a.source_id'
                } else {
                    selectCompany_id = `(select company_id from ${table} where ${table +
                        '_id'}=dataChange.source_id and isValid=1 )`
                    aliasSelectCompany_id = `(select company_id from ${table} where ${table +
                        '_id'}=a.source_id and isValid=1 )`
                }
                return await this.app.pgModel.query(
                    `(select * from dataChange where flag=1 and isValid=1 and dataChange.table='${table}'
                    and log_id=(select  log_id  from dataChange  as a where a.table='${table}' and  isValid =1 and flag =1 and ${aliasSelectCompany_id}=${company_id}  order by a.createdAt desc limit 1)
                        and ${selectCompany_id}=${company_id})`,
                    { type: Sequelize.QueryTypes.SELECT }
                )
            })
        )
        let result = []
        for (const data of datas) {
            result = [...result, ...data]
        }
        if (!result.length) {
            await Company.update(
                {
                    changeFlag: 0,
                    changTime: null
                },
                {
                    where: {
                        isValid: 1,
                        company_id
                    }
                }
            )
        }
        const changeTable = /company/i
        let diff = []
        if (changeTable.test(table)) {
            diff = await this.ctx.service.company.diffCompanyChange({
                type: 'businessFiles',
                company_id
            })
        }
        return error
            ? {
                ...commonCode.confError,
                msg: '字段更新有误'
            }
            : {
                ...commonCode.success,
                diff
            }
    }
    /**
     *
     * @param {object} body
     * @property {number} company_id
     * @returns {object}
     * @example  req:
					必选： company_id:1111
				res:
					{
						code:200 成功, 202 用户数据不完整 , 203 非法访问  ,204 失败 , 205 未登录
						msg:'sucess' ,
						datas: [
							{
								companyTrademark_id,
								name:  STRING(200), // 专利名称
								status: STRING(100), // 状态
								registerNo: STRING(80), // 注册号
								interClass: STRING(80), // 国际分类
								flowClass:  STRING(80), //  流程分类
								trademarkType:  STRING(80), //  流程分类
								fristAuditNo:  STRING(80), // 初审号
								applicationStatus: STRING(30), // 申请状态
								applicationDate: DATEONLY, // 申请日期
								applicant: STRING(500),   // 申请人
								applicationAdress:  STRING(500), // 申请地址
								agent: STRING(30), // 代理机构
							}
						]

				}
     */
    async getCompanyTrademark(body) {
        await SchemaPromise(body, ['company_id'])
        let {
            content,
            company_id,
            page = 1,
            pageSize = 20,
            applicationDate,
            applicationStatus,
            flowClass,
            interClass
        } = body
        const { CompanyTrademark: MODEL, TrademarkFlow } = this.app.pgModel
        const { fn, col, Op } = this.app.Sequelize
        page = page | 0
        pageSize = pageSize | 0
        let where = {
            isValid: 1,
            company_id
        }
        if (content) {
            Object.assign(where, {
                [Op.or]: [
                    'name',
                    'registerNo',
                    'flowClass',
                    'applicant',
                    'fristAuditNo',
                    'applicationStatus',
                    'applicant',
                    'applicationAdress',
                    'agent',
                    'regIssue',
                    'productServiceList'
                ].map(key => {
                    return {
                        [key]: {
                            [Op.like]: `%${content}%`
                        }
                    }
                })
            })
        }
        if (
            !['applicationDate', 'status', 'interClass'].every(key => {
                /**
                 * applicationDate为Date类型，而前端传过来的值为年份
                 */
                if (body.hasOwnProperty(key) && (body[key] || body[key] === null)) {
                    if (key === 'applicationDate' && body[key]) {
                        let year = Number(body[key])
                        if (!(year >= 1960 && year <= 2050)) {
                            return false
                        }
                        let gtyear = `${year}-01-01`
                        let ltyear = `${year + 1}-01-01`
                        Object.assign(where, {
                            [key]: {
                                [Op.gte]: gtyear,
                                [Op.lt]: ltyear
                            }
                        })
                        return true
                    }
                    Object.assign(where, {
                        [key]: body[key]
                    })
                }
                return true
            })
        ) {
            return {
                ...commonCode.fail,
                msg: 'applicationDate字段格式有误'
            }
        }
        //SELECT year(createdAt),count(*) FROM xc_dev.companytrademark group by year(createdAt)
        let counts = await Promise.all(
            ['applicationDate', 'status', 'interClass'].map(key => {
                if (key === 'applicationDate') {
                    return MODEL.findAll({
                        where,
                        group: [fn('year', col(key))],
                        attributes: [[fn('year', col(key)), key], [fn('count', '*'), 'count']],
                        raw: true
                    })
                } else {
                    return MODEL.findAll({
                        where,
                        group: key,
                        attributes: [key, [fn('count', '*'), 'count']],
                        raw: true
                    })
                }
            })
        )

        let datas = await MODEL.findAll({
            where,
            offset: (page - 1) * pageSize,
            limit: pageSize,
            order: [['applicationDate', 'desc']],
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'isValid'] },
            include: [
                {
                    model: TrademarkFlow,
                    where: {
                        isValid: 1
                    },
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'isValid'] },
                    required: false
                }
            ]
        })
        datas = datas.map(data => {
            let temp = data.get({
                plain: true
            })
            temp.flow = temp.trademarkFlows
            delete temp.trademarkFlows
            return temp
        })
        return {
            ...commonCode.success,
            datas,
            counts
        }
    }
    /**
     * 企业的商标 增加  修改
     * @param {Object} body
     * @example
     *
        {flag:'add,update,delete' ,
        companyTrademark_id,  company_id,

        name:  STRING(200), // 专利名称
        status: STRING(100), // 状态
        registerNo: STRING(80), // 注册号
        interClass: STRING(80), // 国际分类
        flowClass:  STRING(80), //  流程分类
        trademarkType:  STRING(80), //  流程分类
        fristAuditNo:  STRING(80), // 初审号
        applicationStatus: STRING(30), // 申请状态
        applicationDate: DATEONLY, // 申请日期
        applicant: STRING(500),   // 申请人
        applicationAdress:  STRING(500), // 申请地址
        agent: STRING(30), // 代理机构}
     */
    async processCompanyTrademark(body) {
        await SchemaPromise(body, ['company_id', 'flag'])
        const { CompanyTrademark, TrademarkFlow } = this.app.pgModel
        const { flag, flow = [] } = body
        if (!Array.isArray(flow)) {
            return {
                ...commonCode.fail,
                msg: 'flow字段格式不对'
            }
        }
        if (['update', 'delete'].includes(flag)) {
            await SchemaPromise(body, ['companyTrademark_id'])
        }

        let datas = {
            datas: [body]
        }
        let promiseArr = []
        let conf = [
            {
                model: CompanyTrademark,
                name: 'datas',
                id: 'companyTrademark_id',
                add: [
                    'company_id',
                    'image',
                    'name',
                    'status',
                    'registerNo',
                    'interClass',
                    'flowClass',
                    // 'trademarkType',
                    'fristAuditNo',
                    // 'applicationStatus',
                    'applicationDate',
                    'applicant',
                    'applicationAdress',
                    'agent',
                    'regIssue',
                    'liveTime_start',
                    'liveTime_end',
                    'productServiceList',
                    'accessory'
                ],
                update: [
                    'image',
                    'name',
                    'status',
                    'registerNo',
                    'interClass',
                    'flowClass',
                    // 'trademarkType',
                    'fristAuditNo',
                    // 'applicationStatus',
                    'applicationDate',
                    'applicant',
                    'applicationAdress',
                    'agent',
                    'regIssue',
                    'liveTime_start',
                    'liveTime_end',
                    'productServiceList',
                    'accessory'
                ],
                del: []
            }
        ]
        promiseArr = processConfig({ conf, _id: {}, body: datas })
        try {
            let [instance] = await Promise.all(promiseArr)
            for (let [
                index,
                { flag: subFlag, trademarkFlow_id, companyTrademark_id, flowText, flowDate }
            ] of flow.entries()) {
                if (flag === 'add') {
                    companyTrademark_id = instance.companyTrademark_id
                } else {
                    companyTrademark_id = companyTrademark_id || body.companyTrademark_id
                }
                if (subFlag === 'add') {
                    if (!companyTrademark_id) {
                        return {
                            ...commonCode.fail,
                            msg: 'companyTrademark_id字段错误'
                        }
                    }
                    await TrademarkFlow.create({
                        companyTrademark_id,
                        flowText,
                        flowDate
                    })
                } else if (subFlag === 'update') {
                    if (!trademarkFlow_id) {
                        return {
                            ...commonCode.fail,
                            msg: 'trademarkFlow_id字段有误'
                        }
                    }
                    let temp = filter(flow[index], ['flowText', 'flowDate'])
                    await TrademarkFlow.update(
                        {
                            ...temp
                        },
                        {
                            where: {
                                isValid: 1,
                                trademarkFlow_id
                            }
                        }
                    )
                } else if (subFlag === 'delete') {
                    await TrademarkFlow.update(
                        {
                            isValid: 0
                        },
                        {
                            where: {
                                isValid: 1,
                                trademarkFlow_id
                            }
                        }
                    )
                }
            }
            if (flag === 'add') {
                return {
                    ...commonCode.success,
                    datas: instance
                }
            }

            return {
                ...commonCode.success
            }
        } catch (err) {
            this.ctx.logger.error(err)
            return {
                ...commonCode.confError
            }
        }
    }
    /**
     * 作品著作权
     * 按首次发表日期(fristPublicDate)排序
     * @param {object} body
     */
    async getCompanyWorksCopyright(body) {
        await SchemaPromise(body, ['company_id'])
        let { content, page = 1, pageSize = 20 } = body
        page = page | 0
        pageSize = pageSize | 0
        const { company_id } = body
        const { WorksCopyright: MODEL } = this.app.pgModel
        const { fn, col, Op } = this.app.Sequelize
        let where = {
            isValid: 1,
            company_id
        }
        if (content) {
            Object.assign(where, {
                [Op.or]: [
                    'name',
                    // 'fristPublicDate',
                    // 'completionDate',
                    'registerNo',
                    // 'registerDate',
                    'registerType'
                ].map(key => {
                    return {
                        [key]: {
                            [Op.like]: `%${content}%`
                        }
                    }
                })
            })
        }
        if (
            !['fristPublicDate', 'registerDate', 'registerType'].every(key => {
                /**
                 * applicationDate为Date类型，而前端传过来的值为年份
                 */
                if (body.hasOwnProperty(key) && (body[key] || body[key] === null)) {
                    if ((key === 'fristPublicDate' || key === 'registerDate') && body[key]) {
                        let year = Number(body[key])
                        if (!(year >= 1960 && year <= 2050)) {
                            return false
                        }
                        let gtyear = `${year}-01-01`
                        let ltyear = `${year + 1}-01-01`
                        Object.assign(where, {
                            [key]: {
                                [Op.gte]: gtyear,
                                [Op.lt]: ltyear
                            }
                        })
                        return true
                    }
                    Object.assign(where, {
                        [key]: body[key]
                    })
                }
                return true
            })
        ) {
            return {
                ...commonCode.fail,
                msg: 'fristPublicDate或registerDate字段格式有误'
            }
        }
        let counts = await Promise.all(
            ['fristPublicDate', 'registerDate', 'registerType'].map(key => {
                if (key === 'fristPublicDate' || key === 'registerDate') {
                    return MODEL.findAll({
                        where,
                        group: [fn('year', col(key))],
                        attributes: [[fn('year', col(key)), key], [fn('count', '*'), 'count']],
                        raw: true
                    })
                } else {
                    return MODEL.findAll({
                        where,
                        group: key,
                        attributes: [key, [fn('count', '*'), 'count']],
                        raw: true
                    })
                }
            })
        )
        const { rows: datas, count } = await MODEL.findAndCountAll({
            where,
            offset: (page - 1) * pageSize,
            limit: pageSize,
            order: [['fristPublicDate', 'DESC']],
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'isValid'] },
            raw: true
        })
        return {
            ...commonCode.success,
            datas,
            count,
            counts
        }
    }
    /**
     *
     * @param {Object} body
     * @example
     * {
     *      flag:"add",
     *      worksCopyright_id:1,
     *      company_id:1,
     *      name:"哈哈,
     *      fristPublicDate:'',
     *      completionDate:'',
     *      registerNo:'',
     *      registerDate:'',
     *      registerType:''
     * }
     * @returns {Object}
     * @example
     * {
     *      code:200,
     *      msg:"success",
     *      datas:{worksCopyright_id:1}
     * }
     */
    async processWorksCopyright(body) {
        await SchemaPromise(body, ['company_id', 'flag'])
        const { WorksCopyright } = this.app.pgModel
        const { flag } = body
        if (['update', 'delete'].includes(flag)) {
            await SchemaPromise(body, ['worksCopyright_id'])
        }
        let datas = {
            datas: [body]
        }
        let promiseArr = []
        let conf = [
            {
                model: WorksCopyright,
                name: 'datas',
                id: 'worksCopyright_id',
                add: [
                    'company_id',
                    'name',
                    'fristPublicDate',
                    'completionDate',
                    'registerNo',
                    'registerDate',
                    'registerType',
                    'accessory'
                ],
                update: [
                    'name',
                    'fristPublicDate',
                    'completionDate',
                    'registerNo',
                    'registerDate',
                    'registerType',
                    'accessory'
                ],
                del: []
            }
        ]
        promiseArr = processConfig({ conf, _id: {}, body: datas })
        try {
            let [instance] = await Promise.all(promiseArr)
            if (flag === 'add') {
                return {
                    ...commonCode.success,
                    datas: instance
                }
            }
            return {
                ...commonCode.success
            }
        } catch (err) {
            this.ctx.logger.error(err)
            return {
                ...commonCode.confError
            }
        }
    }
    async getCompanySoftwareCopyright(body) {
        await SchemaPromise(body, ['company_id'])
        let { company_id, content, page = 1, pageSize = 20 } = body
        const { SoftwareCopyright: MODEL } = this.app.pgModel
        let where = {
            isValid: 1,
            company_id
        }
        page = page | 0
        pageSize = pageSize | 0
        const { Op, col, fn } = this.app.Sequelize
        if (content) {
            Object.assign(where, {
                [Op.or]: [
                    'name',
                    'versionNo',
                    // 'publishedAt',
                    'shortName',
                    'registerNo'
                    // 'registerCompleteDate'
                ].map(key => {
                    return {
                        [key]: {
                            [Op.like]: `%${content}%`
                        }
                    }
                })
            })
        }
        if (
            !['publishedAt', 'registerCompleteDate', 'versionNo'].every(key => {
                /**
                 * applicationDate为Date类型，而前端传过来的值为年份
                 */
                if (body.hasOwnProperty(key) && (body[key] || body[key] === null)) {
                    if ((key === 'publishedAt' || key === 'registerCompleteDate') && body[key]) {
                        let year = Number(body[key])
                        if (!(year >= 1960 && year <= 2050)) {
                            return false
                        }
                        let gtyear = `${year}-01-01`
                        let ltyear = `${year + 1}-01-01`
                        Object.assign(where, {
                            [key]: {
                                [Op.gte]: gtyear,
                                [Op.lt]: ltyear
                            }
                        })
                        return true
                    }
                    Object.assign(where, {
                        [key]: body[key]
                    })
                }
                return true
            })
        ) {
            return {
                ...commonCode.fail,
                msg: 'applicationDate字段格式有误'
            }
        }
        let counts = await Promise.all(
            ['publishedAt', 'registerCompleteDate', 'versionNo'].map(key => {
                if (key === 'publishedAt' || key === 'registerCompleteDate') {
                    return MODEL.findAll({
                        where,
                        group: [fn('year', col(key))],
                        attributes: [[fn('year', col(key)), key], [fn('count', '*'), 'count']],
                        raw: true
                    })
                } else {
                    return MODEL.findAll({
                        where,
                        group: key,
                        attributes: [key, [fn('count', '*'), 'count']],
                        raw: true
                    })
                }
            })
        )
        const { rows: datas, count } = await MODEL.findAndCountAll({
            where,
            offset: (page - 1) * pageSize,
            limit: pageSize,
            order: [['publishedAt', 'DESC']],
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'isValid'] },
            raw: true
        })
        return {
            ...commonCode.success,
            datas,
            count,
            counts
        }
    }
    async processCompanySoftwareCopyright(body) {
        await SchemaPromise(body, ['company_id', 'flag'])
        const { SoftwareCopyright } = this.app.pgModel
        const { flag } = body
        if (['update', 'delete'].includes(flag)) {
            await SchemaPromise(body, ['softwareCopyright_id'])
        }
        let datas = {
            datas: [body]
        }
        let promiseArr = []
        let conf = [
            {
                model: SoftwareCopyright,
                name: 'datas',
                id: 'softwareCopyright_id',
                add: [
                    'company_id',
                    'name',
                    'versionNo',
                    'publishedAt',
                    'shortName',
                    'registerNo',
                    'registerCompleteDate',
                    'accessory'
                ],
                update: [
                    'name',
                    'versionNo',
                    'publishedAt',
                    'shortName',
                    'registerNo',
                    'registerCompleteDate',
                    'accessory'
                ],
                del: []
            }
        ]
        promiseArr = processConfig({ conf, _id: {}, body: datas })
        try {
            let [instance] = await Promise.all(promiseArr)
            if (flag === 'add') {
                return {
                    ...commonCode.success,
                    datas: instance
                }
            }
            return {
                ...commonCode.success
            }
        } catch (err) {
            this.ctx.logger.error(err)
            return {
                ...commonCode.confError
            }
        }
    }

    
    //企业信息产品列表
    async searchProductList(body) {
        let { page = 1, pageSize = 5, sortField, sortOrder, company_id , name } = body
        await SchemaPromise(body, ['company_id'])
        let { park_id } = this.ctx
        if (!this.ctx.session.user || !park_id) {
            return {
                ...commonCode.unLogin
            }
        }
        let { Product, Company, ProductFile } = this.app.pgModel
        const { Op, literal, col } = this.app.Sequelize
        let options = {}
        if (sortField && sortOrder) {
            options.order = [[literal(`${sortField} is not null`), 'DESC'], [sortField, sortOrder]]
        } else {
            options.order = [['createdAt', 'DESC']]
        }
        let skipNum = (page - 1) * pageSize
        options.offset = skipNum
        options.limit = Number(pageSize) 
        options.distinct = true
        options.where = { company_id, isValid: 1 }
        if (name) {
            options.where.name = {
                [Op.like]: `%${name}%`
            }
        }
        options.attributes = { exclude: ['isValid', 'updatedAt', 'deletedAt'] }
        options.include = [
            {
                model: Company,
                where: { isValid: 1, park_id },
                attributes: ['name']
            },
            {
                model: ProductFile,
                where: { isValid: 1 },
                required: false,
                attributes: { exclude: ['isValid', 'updatedAt', 'deletedAt'] }
                //attributes: [productFile_id,'file_id', 'flag', 'url']
            }
        ]
        console.log(5555, options)
        let result = await Product.findAndCountAll(options)
        
        if (result) {
            return {
                ...commonCode.success,
                datas: result
            }
        } else {
            return {
                ...commonCode.fail,
                msg: '查询失败'
            }
        }
    }
    //企业产品信息详情
    async getCompanyProductDetail(query) {
        let { companyProduct_id = 16 } = query
        let { park_id } = this.ctx
        if (!this.ctx.session.user || !park_id) {
            return {
                ...commonCode.unLogin
            }
        }
        //检测参数完整性
        if (!companyProduct_id) {
            return {
                ...commonCode.parameterError
            }
        }
        let { Product, ProductFile, File } = this.app.pgModel
        let result = await Product.findOne({
            where: { product_id: companyProduct_id, isValid: 1 },
            attributes: { exclude: ['isValid', 'createdAt', 'updatedAt', 'deletedAt'] },
            include: [
                {
                    model: ProductFile,
                    where: { isValid: 1, product_id: companyProduct_id },
                    attributes: ['productFile_id', 'file_id', 'flag', 'url'],
                    required: false
                }
            ]
        })
        if (!result) {
            return {
                ...commonCode.fail
            }
        }
        return {
            ...commonCode.success,
            datas: result
        }
    }

    //企业信息产品增删改
    async processCompanyProduct(body) {
        await SchemaPromise(body, ['company_id', 'flag'])
        const { Product, ProductFile, File } = this.app.pgModel
        const { company_id, flag, companyProduct_id } = body
        if (['update', 'delete'].includes(flag)) {
            await SchemaPromise(body, ['companyProduct_id'])
        }
        let { park_id } = this.ctx
        if (!this.ctx.session.user || !park_id) {
            return {
                ...commonCode.unLogin
            }
        }

        let {
            name, // = '文件测试3',
            industry,
            joinDate,
            joinAddress,
            contact,
            contactNumber,
            details,
            advantage,
            winLog,
            officialWeb,
            files, //= [{ file_id: '79ecf94ce0db00a06fa1.png1', flag: 1,flag：'add' },{flag:2,url:"url",flag:'delete'}]
            //新增字段
            isNationalLeve,
            productType,
            aidingWays,
            aidingNum,
            achievementClass,
            tecMaturity,
            formsOfCooperation,
            advantageAnalysis,
            confFieldOfTechnology_id,
            developmentCycle,
            salesRevenueForLastYear,
            patantNum,
            techSource,
            RDexpenses,
            RDexpenses3yearTotal,
            RDexpenses1year,
            RDexpenses2year,
            RDexpenses3year,
            applyField,
            year,
            cooperative,
            fieldOfTechnology
        } = body

        switch (flag) {
        case 'add': {
            await SchemaPromise(body, ['name']) //, 'joinDate'
            let options = {
                where: {
                    company_id,
                    name,
                    isValid: 1
                },
                defaults: {
                    company_id,
                    name,
                    industry,
                    joinDate,
                    joinAddress,
                    contact,
                    contactNumber,
                    details,
                    advantage,
                    winLog,
                    officialWeb,
                    //新增字段
                    isNationalLeve,
                    productType,
                    aidingWays,
                    aidingNum,
                    achievementClass,
                    tecMaturity,
                    formsOfCooperation,
                    advantageAnalysis,
                    confFieldOfTechnology_id,
                    developmentCycle,
                    salesRevenueForLastYear,
                    patantNum,
                    techSource,
                    RDexpenses,
                    RDexpenses3yearTotal,
                    RDexpenses1year,
                    RDexpenses2year,
                    RDexpenses3year,
                    applyField,
                    year,
                    cooperative,
                    fieldOfTechnology
                }
            }
            //查找该项目name?pass:创建
            let production = await new Promise((resolve, reject) => {
                Product.findOrCreate(options).spread((production, created) => {
                    if (created) {
                        resolve(
                            production.get({
                                plain: true
                            })
                        )
                        //存储文件信息到productFile
                        let product_id = production.product_id
                        if (files && files instanceof Array && files.length) {
                            for (let i = 0; i < files.length; i++) {
                                let oFile = files[i]
                                if (oFile && JSON.stringify(oFile) != '{}') {
                                    let file = {
                                        product_id: product_id,
                                        flag: oFile.fFlag
                                    }
                                    if (oFile.fFlag == 1) {
                                        file.file_id = oFile.file_id
                                    } else if (oFile.fFlag == 2) {
                                        file.url = oFile.url
                                    }
                                    ProductFile.create(file)
                                }
                            }
                        }
                    } else {
                        resolve(false)
                    }
                })
            })
            if (!production) {
                return {
                    ...commonCode.fail,
                    msg: '该项目已存在'
                }
            } else {
                return {
                    ...commonCode.success,
                    datas: production.product_id
                }
            }
        }
        case 'update': {
            let values = {}
            if (
                !SchemaTrue(body, [
                    'name',
                    'industry',
                    'joinDate',
                    'joinAddress',
                    'contact',
                    'contactNumber',
                    'details',
                    'advantage',
                    'winLog',
                    'officialWeb',
                    //新增字段
                    'isNationalLeve',
                    'productType',
                    'aidingWays',
                    'aidingNum',
                    'achievementClass',
                    'tecMaturity',
                    'formsOfCooperation',
                    'advantageAnalysis',
                    'confFieldOfTechnology_id',
                    'developmentCycle',
                    'salesRevenueForLastYear',
                    'patantNum',
                    'techSource',
                    'RDexpenses',
                    'RDexpenses3yearTotal',
                    'RDexpenses1year',
                    'RDexpenses2year',
                    'RDexpenses3year',
                    'applyField',
                    'year',
                    'cooperative',
                    'fieldOfTechnology'
                ])
            ) {
                return {
                    ...commonCode.parameterError
                }
            } else {
                if (name) {
                    let hasP = await Product.findOne({
                        where: { name, company_id, isValid: 1 }
                    })
                    if (hasP && hasP.dataValues.product_id != companyProduct_id) {
                        return {
                            ...commonCode.fail,
                            datas: '项目名已存在'
                        }
                    } else {
                        values.name = name
                    }
                }

                Object.assign(
                    values,
                    filter(body, [
                        'company_id',
                        'industry', //所属行业
                        'joinDate', //入住日期
                        'joinAddress', //入住地址
                        'contact', //联系人
                        'contactNumber', //联系电话
                        'details', //详情
                        'advantage', //优势
                        'winLog', //获奖记录
                        'officialWeb', //官网
                        //新增字段
                        'isNationalLeve',
                        'productType',
                        'aidingWays',
                        'aidingNum',
                        'achievementClass',
                        'tecMaturity',
                        'formsOfCooperation',
                        'advantageAnalysis',
                        'confFieldOfTechnology_id',
                        'developmentCycle',
                        'salesRevenueForLastYear',
                        'patantNum',
                        'techSource',
                        'RDexpenses',
                        'RDexpenses3yearTotal',
                        'RDexpenses1year',
                        'RDexpenses2year',
                        'RDexpenses3year',
                        'applyField',
                        'year',
                        'cooperative',
                        'fieldOfTechnology'
                    ])
                )
            }
            let upP = await Product.update(values, {
                where: {
                    product_id: companyProduct_id,
                    isValid: 1
                }
            })
            //文件更新
            let state = true
            let msg = []
            if (files && files instanceof Array && files.length) {
                // state = true
                for (let i = 0; i < files.length; i++) {
                    let oFile = files[i]
                    let fileInfo
                    if (oFile.fFlag == 1 && oFile.flag == 'add') {
                        fileInfo = await File.findOne({
                            where: { file_id: oFile.file_id, isValid: 1 }
                        })
                    }
                    // else if(oFile.fFlag==2){
                    //     fileInfo = await File.findOne({ where: { url: oFile.url, isValid: 1 } })
                    // }
                    if (
                        (oFile.fFlag == 1 && fileInfo && oFile.flag == 'add') ||
                            oFile.fFlag == 2 ||
                            (oFile.fFlag == 1 && oFile.flag == 'delete')
                    ) {
                        if (oFile.flag == 'add') {
                            if (oFile.fFlag == 1 && oFile.file_id) {
                                //增加图片
                                let result = await ProductFile.create({
                                    product_id: companyProduct_id,
                                    flag: oFile.fFlag,
                                    file_id: oFile.file_id
                                })
                                if (!result) {
                                    state = false
                                    msg.push('add picture err')
                                }
                            } else if (oFile.fFlag == 2 && oFile.url) {
                                //增加视频
                                let result = await ProductFile.create({
                                    product_id: companyProduct_id,
                                    flag: oFile.fFlag,
                                    url: oFile.url
                                })
                                if (!result) {
                                    state = false
                                    msg.push('add video err')
                                }
                            }
                        } else if (oFile.flag == 'delete' && oFile.productFile_id) {
                            let result = await ProductFile.update(
                                { isValid: 0 },
                                { where: { productFile_id: oFile.productFile_id, isValid: 1 } }
                            )
                            if (!result[0]) {
                                state = false
                                msg.push('delete file err')
                            }
                        } else {
                            return {
                                ...commonCode.fail,
                                datas: '参数有误'
                            }
                        }
                    } else {
                        state = false
                        msg.push('文件不存在')
                    }
                }
            }

            if (upP[0] && state) {
                return {
                    ...commonCode.success
                }
            } else {
                return {
                    ...commonCode.fail,
                    msg: '文件操作失败'
                }
            }
        }
        case 'delete': {
            let result = await Product.update(
                { isValid: 0 },
                { where: { product_id: companyProduct_id, isValid: 1 } }
            )

            if (files && files instanceof Array && files.length) {
                for (let i = 0; i < files.length; i++) {
                    let oFile = files[i]
                    if (oFile && JSON.stringify(oFile) != '{}') {
                        let file = {
                            product_id: companyProduct_id,
                            flag: oFile.flag,
                            isValid: 1
                        }
                        if (oFile.flag == 1) {
                            file.file_id = oFile.file_id
                        } else if (oFile.flag == 2) {
                            file.url = oFile.url
                        }
                        ProductFile.update({ isValid: 0, where: file })
                    }
                }
            }
            if (!result[0]) {
                return {
                    ...commonCode.fail
                }
            }
            return {
                ...commonCode.success
            }
        }
        default:
            break
        }
    }
    async getCompanyBusinessFiles(body) {
        await SchemaPromise(body, ['company_id'])
        let { company_id } = body
        let { CompanyBusinessFiles } = this.app.pgModel
        let diff = await this.service.company.diffCompanyChange({
            type: 'businessFiles',
            company_id
        })
        return {
            ...commonCode.success,
            diff
        }
        // let datas = await CompanyBusinessFiles.findOne({
        //     where: {
        //         isValid: 1,
        //         companyFiles_id
        //     },
        //     attributes: { exclude: ['isValid', 'updatedAt', 'deletedAt'] },
        //     order: [['createdAt', 'desc']],
        //     raw: true
        // })
        // return {
        //     ...commonCode.success,
        //     datas
        // }
    }
    async updateCompanyBusinessFiles(body) {
        await SchemaPromise(body, ['companyBusinessFiles_id'])
        let { companyBusinessFiles_id } = body
        let { CompanyBusinessFiles } = this.app.pgModel
        let instance = await CompanyBusinessFiles.findOne({
            where: {
                isValid: 1,
                companyBusinessFiles_id
            },
            attributes: { exclude: ['isValid', 'updatedAt', 'deletedAt'] }
        })

        if (!instance) {
            return {
                ...commonCode.fail,
                msg: '不存在'
            }
        }
        Object.assign(
            instance,
            filter(body, [
                'name',
                'business',
                'companyType',
                'address',
                'socialCreditCode',
                'biz_license_registration_code',
                'biz_license_paidin_capital',
                'biz_license_serial_number',
                'biz_license_composing_form ',
                'biz_license_operating_period',
                'registeredCapital',
                'legalRepresentative',
                'operationRange',
                'establishmentDate'
            ])
        )
        await instance.save()
        return {
            ...commonCode.success
        }
    }
    async updateAiRecognition(body) {
        await SchemaPromise(body, ['aiRecognition_id'])
        let { AiRecognition } = this.app.pgModel
        const { aiRecognition_id } = body
        await AiRecognition.update(
            {
                isSure: 1
            },
            {
                where: {
                    aiRecognition_id,
                    isSure: 0,
                    isValid: 1
                }
            }
        )
        return {
            ...commonCode.success
        }
    }
    async upgrade(body) {
        await SchemaPromise(body, ['url', 'name', 'company_id'])
        const { url, name, company_id } = body
        const {
            Company,
            AiRecognition,
            File,
            ConfCompanyInfoType,
            CompanyQualification,
            CompanyFiles,
            RegionCompany,
            RegionHatchStatus
        } = this.app.pgModel
        const { park_id } = this.ctx
        let existCompany = await Company.findOne({
            where: {
                isValid: 1,
                park_id,
                name
            }
        })
        if (existCompany) {
            return {
                ...commonCode.companyNameExist
            }
        }
        let file = await File.findOne({
            where: {
                isValid: 1,
                file_id: url
            },
            attributes: ['sourcePath']
        })
        if (!file) {
            this.logger.warn('营业执照文件不存在')
        } else {
            try {
                let isExist = await AiRecognition.findOne({
                    where: {
                        file_id: url,
                        isValid: 1
                    }
                })
                if (!isExist) {
                    let { sourcePath: imagePath } = file
                    // const AIurl = this.app.config.AIurl
                    let result = await curlXfyun({
                        curl: this.ctx.curl.bind(this.ctx),
                        imagePath,
                        prefix: this.ctx.app.config.prefix
                    })

                    let data = result.data.data

                    let tranfromField = {
                        biz_license_address: 'address',
                        biz_license_company_name: 'name',
                        biz_license_company_type: 'companyType',
                        biz_license_credit_code: 'socialCreditCode',
                        biz_license_operating_period: 'biz_license_operating_period',
                        biz_license_owner_name: 'legalRepresentative',
                        biz_license_reg_capital: 'registeredCapital',
                        biz_license_registration_code: 'biz_license_registration_code',
                        biz_license_scope: 'operationRange',
                        biz_license_start_time: 'establishmentDate'
                    }
                    console.log('data', data)
                    console.log('result', result)
                    if (data && result.data.desc === 'success') {
                        await AiRecognition.bulkCreate(
                            Object.keys(tranfromField).map(key => ({
                                file_id: url,
                                field: tranfromField[key],
                                recogniteData: data[key]
                            }))
                        )
                        // let temp = {}
                        // Object.entries(tranfromField).forEach(
                        //     ([oldKey, newKey]) => {
                        //         if (typeof newKey === 'object') {
                        //             let format = newKey.format
                        //             newKey = newKey.key
                        //             temp[newKey] = format(data[oldKey])
                        //         } else {
                        //             temp[newKey] = data[oldKey]
                        //         }
                        //     }
                        // )
                        // await CompanyBusinessFiles.create(
                        //     Object.assign(temp, {
                        //         companyFiles_id,
                        //         company_id
                        //     })
                        // )
                    }
                }
            } catch (err) {
                this.ctx.logger.error(err)
                // this.ctx.logger.info(_result)
                this.ctx.logger.error('营业执照识别错误')
            }
        }

        // await CompanyFiles.create({
        //     company_id,
        //     confCompanyInfoType_id
        // })
        //上传营业执照
        let confCompanyInfoType = await ConfCompanyInfoType.findOne({
            where: {
                isValid: 1,
                park_id,
                name: '营业执照'
            },
            attributes: ['confCompanyInfoType_id'],
            raw: true
        })
        if (!confCompanyInfoType) {
            return {
                ...commonCode.fail,
                msg: '营业执照配置项不存在'
            }
        }
        let oldfile = await CompanyFiles.findOne({
            where: {
                company_id,
                confCompanyInfoType_id: confCompanyInfoType.confCompanyInfoType_id,
                isValid: 1
            }
        })
        if (oldfile) {
            oldfile.url = url
            await oldfile.save()
        } else {
            await CompanyFiles.create({
                company_id,
                confCompanyInfoType_id: confCompanyInfoType.confCompanyInfoType_id,
                url,
                isValid: 1
            })
        }
        // await CompanyFiles.create({
        //     company_id,
        //     confCompanyInfoType_id:confCompanyInfoType.confCompanyInfoType_id,
        //     url,
        //     isValid:1
        // })

        //升级为企业
        let company = await Company.findOne({
            where: {
                isValid: 1,
                company_id
            },
            attributes: ['name', 'teamType', 'company_id']
        })
        if (company.teamType === 1) {
            return {
                ...commonCode.fail,
                msg: '已经为企业'
            }
        }
        let recognitionName = await AiRecognition.findOne({
            where: {
                file_id: url,
                isSure: 0,
                isValid: 1,
                field: 'name'
            },
            attributes: ['recogniteData', 'createdAt'],
            raw: true
        })
        if (recognitionName) {
            if (name !== recognitionName.recogniteData) {
                return {
                    ...commonCode.success,
                    data: {
                        code: 0,
                        diff: {
                            oldValue: recognitionName.recogniteData,
                            newValue: name,
                            createdAt: recognitionName.createdAt
                        }
                    }
                }
            }
        }
        // 团队升级为企业后，所在库由”团队库“切换至“入驻企业库”
        Object.assign(company, {
            name,
            teamType: 1,
            lib: 1
        })

        // 企业状态改为”入驻企业“
        let regionC = await RegionCompany.findOne({ where:{ company_id, isValid: 1 },attributes:['regionCompany_id']})
        await RegionHatchStatus.create({ regionCompany_id: regionC.regionCompany_id, status_id: 1 })

        //团队升级为企业,企业资质和企业类别删除
        await CompanyQualification.update(
            {
                isValid: 0
            },
            {
                where: {
                    isValid: 1,
                    company_id
                }
            }
        )
        company.confCompanyClass_id = null

        await company.save()

        return {
            ...commonCode.success,
            data: {
                code: 1
            }
        }
    }
    async getLeavingCompanies(body) {
        let { park_id } = this.ctx
        let { user_id } = this.ctx.session.user
        let {
            name,
            pageSize = 10,
            page = 1,
            sortField,
            sortOrder,
            start_register,
            end_register,
            establish_start_time,
            establish_end_time,
            entry_start_time,
            entry_end_time,
            business,
            teamType = 1

        } = body
        let { Company, ConfStateOccupancy, CompanyStore, ConfQualification } = this.app.pgModel
        const { Op, literal } = this.app.Sequelize
        let order = [
            [literal('entryTime is not null'), 'DESC'],
            [this.app.Sequelize.col('entryTime'), 'DESC'],
            [literal('convert(company.name using gbk)')]
        ]
        if (sortField && sortOrder) {
            order = [
                [literal(`"${sortField}" is not null`), 'DESC'],
                [this.app.Sequelize.col(sortField), sortOrder.toUpperCase()],
                [literal('convert(company.name using gbk)')]
            ]
        }
        page = page | 0
        pageSize = pageSize | 0
        let companyWhere = {
            isValid: 1,
            hatchStatus: 2,
            teamType
        }
        let restrict = {
            name(key, where) {
                companyWhere[key] = {
                    [Op.like]: `%${name}%`
                }
            },
            business(key, where) {
                companyWhere[Op.or] = [
                    {
                        business: null,
                        operationRange: {
                            [Op.like]: `%${business}%`
                        }
                    },
                    {
                        business: {
                            [Op.like]: `%${business}%`
                        }
                    }
                ]
            }
        }
        let compositeRestrict = [
            {
                bodyField: ['start_register', 'end_register'],
                field: 'fristRegisteredCapital'
            },
            {
                bodyField: ['establish_start_time', 'establish_end_time'],
                field: 'establishmentDate'
            },
            {
                bodyField: ['entry_start_time', 'entry_end_time'],
                field: 'entryTime'
            }
        ]
        for (const { bodyField, field } of compositeRestrict) {
            let start = body[bodyField[0]]
            let end = body[bodyField[1]]
            if (start || end) {
                companyWhere[field] = {}
                if (start) {
                    companyWhere[field][Op.gte] = start
                }
                if (end) {
                    companyWhere[field][Op.lte] = end
                }
            }

        }
        console.log(companyWhere)
        let { rows: datas, count } = await Company.findAndCountAll({
            where: companyWhere,
            order,
            offset: (page - 1) * pageSize,
            limit: pageSize
        })
        return {
            ...commonCode.success,
            datas,
            count
        }

    }
    async getTalentRecruitList(body) {
        let { page = 1, pageSize = 10, company_id } = body
        page = page | 0
        pageSize = pageSize | 0
        const { Company, TalentRecruit } = this.app.pgModel
        let { rows: talentRecruits, count } = await TalentRecruit.findAndCountAll({
            where: {
                isValid: 1,
                company_id
            },
            // offset: (page - 1) * pageSize,
            // limit: pageSize,
            order: [['publishTime', 'DESC']]
        })
        return {
            ...commonCode.success,
            datas: talentRecruits,
            count
        }

    }
    async delCompany() {
        const { Company } = this.app.pgModel
        const { company_id } = this.ctx.params
        if (!company_id) return {
            ...commonCode.fail,
            msg: 'company_id缺失'
        }
        await Company.update({
            isValid: 0
        }, {
            where: {
                company_id,
                isValid: 1
            }
        })
        return {
            ...commonCode.success
        }
    }

}

module.exports = Company

function processConfig({ conf, _id, body }) {
    let promiseArr = []
    for (let { model, name, id: modelId, del, add, update, addFn } of conf) {
        let arr = body[name]

        if (!Array.isArray(arr)) {
            console.log(arr)
            if (arr == null) return promiseArr
            arr = JSON.parse(arr)
        }
        for (const item of arr) {
            let { flag, name } = item
            let id = item[modelId]
            let temp
            switch (flag) {
            case 'add':
                if (!add) break
                temp = filter(item, add)
                if (addFn) {
                    promiseArr.push(addFn(temp, _id))
                    break
                }
                promiseArr.push(
                    (async () => {
                        let instance = await model.create({
                            ..._id,
                            ...temp
                        })
                        return instance.get({
                            plain: true
                        })
                    })()
                )
                break
            case 'update':
                if (!update) break
                promiseArr.push(
                    (async () => {
                        temp = filter(item, update)
                        await model.update(
                            {
                                ...temp
                            },
                            {
                                where: {
                                    isValid: 1,
                                    [modelId]: id
                                },
                                individualHooks: true
                            },

                        )
                    })()
                )
                break
            case 'delete':
                if (!del) break
                promiseArr.push(
                    (async () => {
                        console.log('update', modelId)
                        await model.update(
                            {
                                isValid: 0
                            },
                            {
                                where: {
                                    isValid: 1,
                                    [modelId]: id
                                },
                                individualHooks: true
                            }
                        )
                    })()
                )
                break
            }
        }
    }
    return promiseArr
}
/**
 * @async
 * @function confirm
 * @param {object} param0
 * @property {object[]}  instances 数据确认query实例
 * @property {object} DataChange 数据确认的数据库模板this.app.pgModel['DataChange']
 * @property {object} pgModel this.app.pgModel
 * @property {string} flag flag为2表示确认更新,flag为3表示不更新
 */
async function confirm({ instances, DataChange, pgModel, flag }) {
    if (!Array.isArray(instances)) {
        instances = [instances]
    }
    let error = null
    for (const instance of instances) {
        let { field, table, source_id, data, dataChange_id } = instance
        const idName = tableMapIdName(table)
        /**数据模板表名是大写 */
        table = table.replace(/^[\s\S]/, v => v.toUpperCase())
        const model = pgModel[table]
        /**
         *  更新原始数据表
         */
        if (flag === 2) {
            try {
                /**
                 * companyEmployees,companyEmployees为整体确认
                 * 先删除所有原始数据
                 * 再插入
                 */
                if (/^(companyEmployees|companyShareholders)$/i.test(table)) {
                    await model.update(
                        {
                            isValid: 0
                        },
                        {
                            where: {
                                isValid: 1,
                                company_id: source_id
                            }
                        }
                    )
                    let dataArr
                    try {
                        dataArr = JSON.parse(data)
                    } catch (err) {
                        console.log('数据确认时，data数据格式不对', 'data:', data)
                        console.log(err)
                        return
                    }

                    await model.bulkCreate(dataArr)
                } else {
                    await model.update(
                        {
                            [field]: data
                        },
                        {
                            where: {
                                isValid: 1,
                                [idName]: source_id
                            }
                        }
                    )
                }
            } catch (err) {
                error = err
            }
        }

        /**
         *  更新确认表
         */
        await DataChange.update(
            {
                flag
            },
            {
                where: {
                    isValid: 1,
                    dataChange_id,
                    flag: 1
                }
            }
        )
        if (error) return Promise.reject(error)
    }
}

/**
 * 排序方式
 * 1.专利 发布日期
 * 2.商标 申请日期
 * 3.作品著作权 首次发表日期
 * 4.软件著作权 发布日期
 */
