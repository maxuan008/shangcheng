const Controller = require('egg').Controller

class AdminController extends Controller {


    async searchcompanfun(){ 
        this.ctx.body = await this.service.admin.searchcompanfun(this.ctx.request.body)
        this.ctx.status = 200
    }

    async login(){
        this.ctx.body = await this.service.admin.login(this.ctx.request.body)
        this.ctx.status = 200  
    }

    async logout(){
        this.ctx.body = await this.service.admin.logout(this.ctx.request.body)
        this.ctx.status = 200  
    }
    


    async sessioninfo(){
        this.ctx.body = await this.service.admin.sessioninfo(this.ctx.request.body)
        this.ctx.status = 200  
    }


    async searchf(){
        this.ctx.body = await this.service.factory.search(this.ctx.request.body)
        this.ctx.status = 200  
    }

    async addf(){
        this.ctx.body = await this.service.factory.add(this.ctx.request.body)
        this.ctx.status = 200  
    }

    async updatef(){
        this.ctx.body = await this.service.factory.update(this.ctx.request.body)
        this.ctx.status = 200  
    }

    async destroyf(){
        this.ctx.body = await this.service.factory.destroy(this.ctx.request.body)
        this.ctx.status = 200  
    }

    async destroyManyf(){
        this.ctx.body = await this.service.factory.destroyMany(this.ctx.request.body)
        this.ctx.status = 200  
    }

    async addgroupanduser(){
        this.ctx.body = await this.service.admin.addgroupanduser(this.ctx.request.body)
        this.ctx.status = 200  
    }

    async searchgroupanduser(){
        this.ctx.body = await this.service.admin.searchgroupanduser(this.ctx.request.body)
        this.ctx.status = 200  
    }

    async addgroupadmin(){
        this.ctx.body = await this.service.admin.addgroupadmin(this.ctx.request.body)
        this.ctx.status = 200  
    }
    
    async resetPassword(){
        this.ctx.body = await this.service.admin.resetPassword(this.ctx.request.body)
        this.ctx.status = 200     
    }
}

module.exports = AdminController