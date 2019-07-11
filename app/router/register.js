module.exports = app => {
    console.log('init register router')
    const {
        controller:{
            register:{getcompanylist }
        }
    } = app

    app.post('/api/register/getcompanylist', getcompanylist)


}