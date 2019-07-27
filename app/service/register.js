const Service = require('egg').Service
const uid = require('uid-safe')
const path = require('path')
const crypto = require('crypto')

class Factory extends Service {


    async getcompanylist(body) {
        let {Op} = this.app.Sequelize
        let {Department, Role, Company} = this.app.model
        let {page, pageSize , name } = body

        page = page || 1 , pageSize = pageSize || 10
        //console.log('ok')
        let opts = {
            attributes:['company_id', 'name'],
            include:[
                {
                    model:Department,
                    attributes:['department_id', 'name'],
                    required: true //内链接， false为外链接
                },
                {
                    model:Role,
                    attributes:['role_id', 'name'],
                    required: true
                }
            ]
        }
        if(page && pageSize){
            opts.offset = (parseInt(page) - 1) * parseInt(pageSize)
            opts.limit = parseInt(pageSize)
        }
        
        if(name) opts.where ={name: { [Op.like]: `%${name}%` }} 

        console.log('opts:', opts)
        let docs = await Company.findAll(opts)
        return {status:200 ,msg:'sucess', docs}
    }
   
    async getDepartmentAndRole(body){
        let {company_id} = body
        if(!company_id) return {status:404 ,err:'company_id参数错误'}
        let {Op} = this.app.Sequelize
        let {page, pageSize , name } = body
        page = page || 1 , pageSize = pageSize || 10 

        let {Department, Role} = this.app.model
        let departmentList = await Department.findAll({
            where:{company_id},
            attributes:['department_id','name']
        })

        let roleList = await Role.findAll({
            where:{company_id},
            attributes:['role_id','name']
        })

        let docs = {departmentList, roleList}
        return {status:200 ,msg:'sucess', docs}
    }

    async apply(body){
        //console.log(body)
        // { company_id: '22',
        // department_id: '1',
        // role_id: '1',
        // tel: '12333333333',
        // userName: '张珊',
        // password: '111111' }
        let {company_id, department_id,role_id, tel, userName, password, contact } =body

        if(!contact && tel)  contact = tel
        //1.添加用户
        let salt = await uid(10)
        password = crypto.createHmac("sha256",salt).update(body.password).digest("hex")
        let {User, Userassociate} = this.app.model
        
        let doc = {
            name:userName,
            tel,
            contact,
            salt,
            password
         }
         console.log('doc:', doc)
         let user = await User.findOrCreate({where:{tel} , defaults:doc })
                            //findOrCreate({where:distinctWhere , defaults:data })
         console.log(user)
         if(user[1]) {
            //return {status:200,msg:'sucess', data:user[0]} 
            let {user_id} = user[0]
            //2.添加用户到 用户关联
            let assocDoc = {user_id,company_id, department_id,role_id }
            console.log(assocDoc)
            await Userassociate.create(assocDoc)
            return {status:200 ,msg:'sucess'}
        } else {
            console.log(`注册失败电话号码 ${tel} 已存在`)
            return {status:404,msg:'注册失败电话号码 ${tel} 已存在'} 
        }


    }


}


module.exports = Factory


