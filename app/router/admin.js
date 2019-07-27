module.exports = app => {
    console.log('init admin router')
    const {
        controller:{
            admin:{
                searchcompanfun,
                login,
                logout,
                sessioninfo,

                searchf,
                addf,
                updatef,
                destroyf,
                destroyManyf,
                addgroupanduser,
                searchgroupanduser,
                addgroupadmin,
                resetPassword,
            }
        }
    } = app

    app.post('/api/admin/searchcompanfun', searchcompanfun)
    app.post('/api/admin/login', login)
    app.post('/api/admin/sessioninfo', sessioninfo)
    app.post('/api/admin/logout', logout)

    //工厂化操作
    app.post('/api/admin/searchf', searchf)  
    app.post('/api/admin/addf', addf)  
    app.post('/api/admin/updatef', updatef)    
    app.post('/api/admin/destroyf', destroyf)  
    app.post('/api/admin/destroyManyf', destroyManyf)   

    app.post('/api/admin/addgroupanduser', addgroupanduser)  
    app.post('/api/admin/searchgroupanduser', searchgroupanduser)   //查询集团及对应的用户
    app.post('/api/admin/addgroupadmin', addgroupadmin)  
    app.post('/api/admin/resetPassword', resetPassword)  //重组密码

    
    
}