const Service = require('egg').Service
const uid = require('uid-safe')
const path = require('path')

class Factory extends Service {


    // body ：  
    // {
    //     "mapflag":"grp",  映射的 数据库表名
    //     "attributes":["group_id","isUse"],  //属性
    //     "exclude":["createdAt", "updatedAt", "deletedAt"], //属性排除， attributes的优先级高
    //     "equs":{isUse:1},              //精确匹配,  //where条件精准匹配
    //     "dims":{name: '集团'},         //属性模糊匹配   
    //     "page":1 ,                     //分页
    //     "pageSize":10 ,           //非必选：   分页元素数量
    //     "order":[['name','DESC']]    //非必选:  排序
    // }

    async search(body) {
        let {Op} = this.app.Sequelize
        let { mapflag,dims, attributes , equs,exclude ,page, pageSize, order } = body
        page = page || 1 , pageSize = pageSize || 10
        console.log(mapflag,body)
        if(!mapflag) return {status:404, err:'mapflag参数不正确'}
        if(!dims && !equs) return {status:404, err:'缺少查询条件'}

        if(Object.keys(this.app.config.mapTable).indexOf(mapflag) == -1) return {status:403, err:'未能映射到对应的表,非法操作'}
        let table = this.app.config.mapTable[mapflag].table
        if(!table) return {status:404, err:'映射表错误:table'}
        

        let where = {}, opts = {}
        if(equs) Object.assign(where,equs)
        if(dims) {
            for(let key in dims) {
                where[key] = { [Op.like]: `%${dims[key]}%` }
            }
        }
        if(page && pageSize) {
            opts.offset = (parseInt(page) - 1) * parseInt(pageSize)
            opts.limit = parseInt(pageSize)
        }
        if(order) opts.order = order
        if(exclude) opts.attributes= {exclude}
        if(attributes) opts.attributes= attributes
        opts.where = where
        console.log(opts)
        let docs = await this.app.model[table].findAll(opts)
        return { status:200,msg:'sucess', docs }
    }
    
    async add(body) {
        let { mapflag ,data } = body
        console.log(mapflag ,data)
        if(!mapflag) return {status:404, err:'mapflag参数不正确'}
        if(Object.keys(this.app.config.mapTable).indexOf(mapflag) == -1)  return {status:403, err:'未能映射到对应的表,非法操作'}

        let table = this.app.config.mapTable[mapflag].table
        console.log('table:', table)
        if(!table) return {status:404, err:'映射表错误:table'}


        if(!data ) return {status:404, err:'data参数错误'}
        if(typeof(data) != 'object') return {status:404, err:'data参数必须为json'}
        if(Object.keys(data).length <= 0  ) return {status:404, err:'data参数不能为空'}
        
        
        //获取去重数据 distinct
        let distinct = this.app.config.mapTable[mapflag].distinct , result
        if( distinct == -1 || distinct == undefined )  { //无去重数据的情况，直接创建
            result = await this.app.model[table].create(data)
            return {status:200,msg:'sucess', data:result}
        } else {
            if(Object.keys(distinct).length  <= 0)  return {status:404, err:'请检查映射表distinct不能为{}'}   //去重数据获取失败
            let distinctWhere = this.getDistinc(mapflag,data)
            if(distinctWhere == null) return {status:404, err:'映射表中有去重字段,但是添加数据中不存在去重数据'}

            if(distinctWhere.err) return {status:404, err:distinctWhere.err}
            

            let res = await this.app.model[table].findOrCreate({where:distinctWhere , defaults:data })
            if(res[1]) {
                return {status:200,msg:'sucess', data:res[0]} 
            } else {
                console.log('数据已存在,不能重复插入', res[0].dataValues)
                return {status:404,err:'已存在,不能重复插入'} 
            }

        }

    }


    async update(body) {
        let { mapflag,data,keys } = body
        let {Op} = this.app.Sequelize
        if(!mapflag) return {status:404, err:'mapflag参数不正确'}
        if(Object.keys(this.app.config.mapTable).indexOf(mapflag) == -1)  return {status:403, err:'未能映射到对应的表,非法操作'}

        let table = this.app.config.mapTable[mapflag].table
        if(!table) return {status:404, err:'映射表错误:table'}

        if(!keys) return {status:404, err:'keys参数错误'}
        if(typeof(keys) != 'object') return {status:404, err:'keys参数必须为json'}

        if(!data) return {status:404, err:'data参数错误'}
        if(typeof(data) != 'object') return {status:404, err:'data参数必须为json'}
        if(Object.keys(data).length <= 0  ) return {status:404, err:'data参数不能为空'}

        //获取去重数据 distinct
        let distinct = this.app.config.mapTable[mapflag].distinct , result
        
        let doc =  await this.app.model[table].findOne({where:keys})
        if(!doc)  return {status:404, err:'要更新的数据未找到'}

        if( distinct == -1 || distinct == undefined )  { //映射表无需去重条件,直接去重
            Object.assign(doc,data)
            await doc.save()
            return {status:200,msg:'sucess'}
        } else {  //映射表有去重字段
            let distinctWhere = this.getDistinc(mapflag,data)
            console.log('去重条件：',distinctWhere)
            if(distinctWhere == null ) { //去重数据未找到为空, 可以直接更新
                console.log('警告:更新时未找到去重数据,但是依然会更新')
                Object.assign(doc,data)
                await doc.save()
                return {status:200,msg:'sucess'}
            }

            if(distinctWhere.err) return {status:404, err:distinctWhere.err}

            if(this.app.config.mapTable[mapflag].foreignkey) { //存在外键,加入外键去重
                let foreignObj = this.getforeign(mapflag, doc)
                console.log("存在外键,加入外键去除",foreignObj)
                Object.assign(distinctWhere,foreignObj)
            }

            let where = distinctWhere, primarykey = this.app.config.mapTable[mapflag].primarykey
            if(primarykey) where[primarykey] = {
                [Op.ne]: doc[primarykey]
            }
            let distdoc = await this.app.model[table].findOne({
                where: distinctWhere 
            })

            if(distdoc) { //有重名,失败, 
                console.log('更新失败, 找到了去重条件的数据')
                return {status:404,err:'更新失败, 不能重名'}
            } else { //如果未找到含去重的数据，直接更新
                Object.assign(doc,data)
                await doc.save()
                return {status:200,msg:'sucess'}
            }



        }


    }

    async destroy(body) {
        let { mapflag ,keys  } = body

        if(!mapflag) return {status:404, err:'mapflag参数不正确'}
        if(Object.keys(this.app.config.mapTable).indexOf(mapflag) == -1)  return {status:403, err:'未能映射到对应的表,非法操作'}

        let table = this.app.config.mapTable[mapflag].table
        if(!table) return {status:404, err:'映射表错误:table'}

        if(!keys) return {status:404, err:'keys参数错误'}
        if(typeof(keys) != 'object') return {status:404, err:'keys参数必须为json'}
        if(Object.keys(keys).length <= 0  ) return {status:404, err:'keys参数不能为空'}


        let doc = await this.app.model[table].findOne({where:keys})
        if(!doc) return {status:404, err:'要销毁的数据未找到'}

        await doc.destroy()
        return {status:200,msg:'sucess'}
    }

    async destroyMany(body) {
        let {Op} = this.app.Sequelize
        let { mapflag ,keys  } = body

        if(!mapflag) return {status:404, err:'mapflag参数不正确'}
        if(Object.keys(this.app.config.mapTable).indexOf(mapflag) == -1)  return {status:403, err:'未能映射到对应的表,非法操作'}

        let table = this.app.config.mapTable[mapflag].table
        if(!table) return {status:404, err:'映射表错误:table'}

        if(!keys) return {status:404, err:'keys参数错误'}
        if(typeof(keys) != 'object') return {status:404, err:'keys参数必须为json'}
        if(Object.keys(keys).length <= 0  ) return {status:404, err:'keys参数不能为空'}

        // let doc = await this.app.model[table].findOne({where:keys})
        // if(!doc) return {status:404, err:'要销毁的数据未找到'}
        console.log(111,keys,table)
        let where = {}
        where[this.app.config.mapTable[mapflag].primarykey] = {[Op.in]:keys }
        await this.app.model[table].destroy({where })
        return {status:200,msg:'sucess'}
    }
    




    /**   获取去重的数据
    * @param {string} mapflag   映射表数据库名
    * @param {object{}} data    前端传来要添加的数据
    * @return {object{}}

    */
    getDistinc(mapflag, data){ 
        console.log('map data:',mapflag,data)
        let result = {}
        , distinct = this.app.config.mapTable[mapflag].distinct ,
        foreignkey =  this.app.config.mapTable[mapflag].foreignkey 
        if( distinct == -1 || distinct == undefined )  return {err:'映射表distinct为空, 请检查映射表'}

        for(let key of distinct) {
            if(data[key] == undefined )  {
                console.log('警告:去重数据不包含映射表字段')
                return null
                break
            }
            console.log('key val:', key, data[key])
            result[key] = data[key]

        }
        console.log('getDistinc result:',result )

        if(foreignkey){ //如果外键不为空,则在去重条件中加入外键
            for(let fkey of foreignkey) {
                if(data[fkey] != undefined )  result[fkey] = data[fkey]
            }
        }

        console.log('加入外键后:',  result)

        return result
    }

    getforeign(mapflag, data){ //获取外键的数据:mapflag映射表字段，doc:object数据 
        console.log('map data:',mapflag, data.dataValues)
        let result = {}
        , foreign = this.app.config.mapTable[mapflag].foreignkey
        for(let key of foreign) {
            result[key] = data[key]
        }
        console.log('getforeign result',result )
        return result 
    }

}


module.exports = Factory


