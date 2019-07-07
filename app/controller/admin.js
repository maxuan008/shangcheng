const Controller = require('egg').Controller

class FactoryController extends Controller {


    async searchcompanfun(){ 
        this.ctx.body = await this.service.admin.searchcompanfun(this.ctx.request.body)
        this.ctx.status = 200
    }



}

module.exports = FactoryController