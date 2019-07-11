const Service = require('egg').Service
const uid = require('uid-safe')
const path = require('path')

class Factory extends Service {


    async getcompanylist(body) {
        let {Op} = this.app.Sequelize
        let {page, pageSize , name } = body
        page = page || 1 , pageSize = pageSize || 10
        //console.log('ok')
        let opts = {
            attributes:['company_id', 'name']
        }
        if(page && pageSize) {
            opts.offset = (parseInt(page) - 1) * parseInt(pageSize)
            opts.limit = parseInt(pageSize)
        }
        if(name) where.name = { [Op.like]: `%${name}%` }

        
        let docs = await this.app.model.Company.findAll(opts)
        return {status:200 ,msg:'sucess', docs}
    }
    

}


module.exports = Factory


