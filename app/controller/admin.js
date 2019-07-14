const Controller = require('egg').Controller

class FactoryController extends Controller {


    async searchcompanfun(){ 
        this.ctx.body = await this.service.admin.searchcompanfun(this.ctx.request.body)
        this.ctx.status = 200
    }

    async login(){
        this.ctx.body = await this.service.admin.login(this.ctx.request.body)
        this.ctx.status = 200  
    }

    async sessioninfo(){
        this.ctx.body = await this.service.admin.sessioninfo(this.ctx.request.body)
        this.ctx.status = 200  
    }

}

module.exports = FactoryController