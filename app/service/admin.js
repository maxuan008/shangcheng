const Service = require('egg').Service
const uid = require('uid-safe')
const path = require('path')

class Factory extends Service {


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
    

}


module.exports = Factory


