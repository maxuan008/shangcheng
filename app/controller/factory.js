const Controller = require('egg').Controller

class FactoryController extends Controller {


    async search(){ 
        this.ctx.body = await this.service.factory.search(this.ctx.request.body)
        this.ctx.status = 200
    }

    async add(){
        this.ctx.body = await this.service.factory.add(this.ctx.request.body)
        this.ctx.status = 200
    }

    async update(){
        this.ctx.body = await this.service.factory.update(this.ctx.request.body)
        this.ctx.status = 200
    }

    async destroy() {
      this.ctx.body = await this.service.factory.destroy(this.ctx.request.body)
      this.ctx.status = 200;
    }


}

module.exports = FactoryController