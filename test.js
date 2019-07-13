const uid = require('uid-safe')
const crypto = require('crypto')
//console.log('盐',crypto.enc.Utf8.parse("salt"))


// const sha256 = crypto.createHash("sha256");
// sha256.update("hello,world!");
// console.log(sha256.digest("hex"));


//------------Hmac
const hmac = crypto.createHmac("sha256","salt2dsfaasdfasfsadfdfasdfsdf").update("hello world!").digest("hex");

console.log(hmac);


async function fun() {
    
    let res1 = "aaaa" , res2 = {a:'bbb', b:'2', c:{d:'g'}}
    let res3 = [1,2,3]
    console.log(111, typeof(res1), typeof(res2) , typeof(res3))
    let uuid = await uid(32) 
    console.log(2222, Object.keys(res2), uuid )

    // res3.map(v => { console.log(v)})
    // for(let key in res2 ) console.log(key)

    // let flag = {}
    // if(flag)  console.log(111)
    // else console.log(222)

    let arr = [] , j = {}
    arr.push('a')
    console.log(arr, Object.keys(j).length )

}   

//fun()


//let mapconfig = require('./share/mapconfig.js')
//let mapconfig = require(path.join(app.baseDir, './share/mapconfig.js') )
//console.log(333,mapconfig )



