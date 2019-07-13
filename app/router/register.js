module.exports = app => {
    console.log('init register router')
    const {
        controller:{
            register:{
                getcompanylist,
                getDepartmentAndRole,
                apply
            }
        }
    } = app

    app.post('/api/register/getcompanylist', getcompanylist)
    app.post('/api/register/getDepartmentAndRole', getDepartmentAndRole)
    app.post('/api/register/apply', apply)
    

}