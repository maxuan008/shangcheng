module.exports = app => {
    console.log('init news router')
    const {
        controller:{
            factory:{search, add,  update, destroy,destroyMany}
        }
    } = app

    app.post('/api/factory/search', search)
    app.post('/api/factory/add', add)
    app.post('/api/factory/update', update)
    app.post('/api/factory/destroy', destroy)
    app.post('/api/factory/destroyMany', destroyMany)

}