module.exports = app => {
    console.log('init admin router')
    const {
        controller:{
            admin:{
                searchcompanfun,
                login,
                sessioninfo
            }
        }
    } = app

    app.post('/api/admin/searchcompanfun', searchcompanfun)
    app.post('/api/admin/login', login)
    app.post('/api/admin/sessioninfo', sessioninfo)

}