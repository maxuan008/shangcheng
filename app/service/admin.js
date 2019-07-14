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
        if(!user) return {status:404, err:'用户名或密码错误'}
        
        let {user_id,name,headUrl,account,flag, salt }= user
        let hmac = crypto.createHmac("sha256",salt).update(password).digest("hex");
        console.log('hmac:',hmac)
        if(hmac == user.password  ){ //登陆成功
            this.ctx.session.userInfo ={user_id,name,tel,headUrl,account,flag} 
            return {status:200,  msg:'sucess'}
        }else{
            return  {status:404, err:'用户名或密码错误'}
        }

    }

    async sessioninfo(body){
        let {user_id,name,headUrl,tel,account,flag }=  this.ctx.session.userInfo
        return {
            status:200,   msg:'sucess',
            datas:{
                userInfo:{user_id,name,headUrl,tel,account,flag }  
            }
        }
    }

}


module.exports = Admin


