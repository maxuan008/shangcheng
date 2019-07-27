const Service = require('egg').Service
const uid = require('uid-safe')
const path = require('path')
const crypto = require('crypto')
class Admin extends Service {


    async searchcompanfun(body) {
        let {Op} = this.app.Sequelize
        let {company_id ,page, pageSize, order } = body
        page = page || 1 , pageSize = pageSize || 10
        console.log(body)
        if(!company_id) return {status:404, err:'company_id参数不正确'}

        let {Companyfunview} = this.app.model

        let where = {company_id}, opts = {}

        if(page && pageSize) {
            opts.offset = (parseInt(page) - 1) * parseInt(pageSize)
            opts.limit = parseInt(pageSize)
        }
        if(order) opts.order = order
         
        opts.attributes= ['companyfun_id',  'fun_id', 'funName' ,'isUse']  // 'company_id' , 'companyName' , 
        opts.where = where
        console.log(opts)
        let docs = await Companyfunview.findAll(opts)
        return { status:200,msg:'sucess', docs }
    }
    
    async login(body){
        console.log('user session ',this.ctx.session.userInfo)
        let {tel, password} = body
        if(!tel || !password) return {status:404, err:'tel, password 参数不正确'}
        
        let {User} = this.app.model
        let user = await User.findOne({where:{tel, flag:-1}})
        if(!user) return {status:401, err:'用户名或密码错误'}
        
        let {user_id,name,headUrl,account,flag, salt }= user
        let hmac = crypto.createHmac("sha256",salt).update(password).digest("hex");
        console.log('hmac:',hmac)
        if(hmac == user.password  ){ //登陆成功
            this.ctx.session.userInfo ={user_id,name,tel,headUrl,account,flag} 
            return {status:200,  msg:'sucess'}
        }else{
            return  {status:401, err:'用户名或密码错误'}
        }

    }

    async logout(body){
        delete this.ctx.session.userInfo
        return {status:200,  msg:'sucess'}
    }



    async sessioninfo(body){
        if(!this.ctx.session.userInfo) return {status:405, err:'未登录'}
        let {user_id,name,headUrl,tel,account,flag } = this.ctx.session.userInfo
        return {
            status:200,   
            msg:'sucess',
            datas:{
                userInfo:{user_id,name,headUrl,tel,account,flag }  
            }
        }
    }


    async addgroupanduser(body){
        //1.分离 集团和用户的参数
        let { data:{ username, password } } = body
        if(password=="" || !password)  password = this.app.config.defaultpassword
        if(!username || !password) return {status:404,err:'账户名和秘密不能为空'} 
        delete body.data.username 
        delete body.data.password
        let res = await this.ctx.service.factory.add(body)
        if(res.status != 200) return res

        let { data:{group_id} }=res
        //console.log(username, password,group_id)
        let salt = await uid(10)
        password = crypto.createHmac("sha256",salt).update(password).digest("hex")

        let doc = {salt, password, flag:-2, group_id, tel:username , name:`管理员@${username}` }
        let user = await this.app.model.User.findOrCreate({where:{tel:username} , defaults:doc })
        if(user[1]) {
            return {status:200 ,msg:'sucess'}
        } else {
            console.log(`集团管理员账户添加失败 ${username} 已存在`)
            return {status:404,msg:`集团管理员账户添加失败：${username} 已存在`} 
        }

    }

    async addgroupadmin(body){
        let {group_id, tel, password  } = body 
        if(!group_id || !tel) return {status:404,err:'group_id,tel 参数不争取'} 
        if(password=="" || !password)  password = this.app.config.defaultpassword
        let salt = await uid(10)
        password = crypto.createHmac("sha256",salt).update(password).digest("hex")
        let doc = {salt, password, flag:-2, group_id, tel , name:`管理员@${tel}` }
        let user = await this.app.model.User.findOrCreate({where:{tel} , defaults:doc })
        if(user[1]) {
            return {status:200 ,msg:'sucess'}
        } else {
            console.log(`集团管理员账户添加失败 ${tel} 已存在`)
            return {status:404,err:`集团管理员账户添加失败：${tel} 已存在`} 
        }
    }


    async searchgroupanduser(body){
        let {Op} = this.app.Sequelize
        let {groupname, tel} = body

        let where = {flag:-2}
        if(groupname) where.groupname = { [Op.like]: `%${groupname}%` }
        if(tel) where.tel = { [Op.like]: `%${tel}%` }

        let attributes = ['group_id', 'user_id' , 'groupname', 'username', 'tel', 'email', 'contact'  ]
        let docs = await this.app.model.Groupadminview.findAll({ where, attributes})
        return {status:200 ,msg:'sucess', docs}

    }


    async resetPassword(body){
        let {user_id} = body , password = this.app.config.defaultpassword
        let user = await this.app.model.User.findOne({where:{user_id}})
        if(!user)   return {status:404 ,err:'用户未找到'}
        console.log('resetPassword',user_id, password)
        password = crypto.createHmac("sha256",user.salt).update(password).digest("hex")

        Object.assign(user, {password, isPassChange:0})
        await user.save()
        return {status:200 ,msg:'sucess'}
        
    }



    
}


module.exports = Admin


