const Controller = require('egg').Controller

class RegisterController extends Controller {

    async getcompanylist(){ 
        this.ctx.body = await this.service.register.getcompanylist(this.ctx.request.body)
        this.ctx.status = 200
    }

    async getDepartmentAndRole(){
        this.ctx.body = await this.service.register.getDepartmentAndRole(this.ctx.request.body)
        this.ctx.status = 200     
    }

    async apply(){
        this.ctx.body = await this.service.register.apply(this.ctx.request.body)
        this.ctx.status = 200    
    }



}

module.exports = RegisterController