const Controller = require('egg').Controller

class RegisterController extends Controller {

    async getcompanylist(){ 
        this.ctx.body = await this.service.register.getcompanylist(this.ctx.request.body)
        this.ctx.status = 200
    }






}

module.exports = RegisterController