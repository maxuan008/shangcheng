
const path=require('path')
const fs=require('fs')
module.exports = app => {
    const { router,   controller } = app
    let routerFiles=fs.readdirSync( path.join(__dirname,'./router') )
    console.log(routerFiles)
    
    let routerDIR=path.join(__dirname,'./router')
    routerFiles.map(v=>{
        //console.log(v, path.join( routerPath, v ))
        require(path.join( routerDIR, v ))(app)
    })

}