module.exports = app => {
    console.log('init admin router')
    const {
        controller:{
            admin:{searchcompanfun }
        }
    } = app

    app.post('/api/admin/searchcompanfun', searchcompanfun)


}