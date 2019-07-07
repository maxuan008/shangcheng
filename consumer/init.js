const amqp = require('amqplib')

module.exports =  (app,ctx, msg) => {

    return {
        async task() {
            return new Promise (async (resolve, reject)=>{
                //do something.....
                let message = JSON.parse(msg.content.toString()) , table = message.table 

                // let  park_name = message.park_name, docs = message.datas
                // if(!url || !park_name)  {reject('url,park_name参数不正确'); return ; }
                
                switch(table){
                    case 'companyBusinessInfo':  
                        try {
                            let  park_name = message.park_name, companies = message.datas ,table = message.table 
                            if(!park_name || !table) {console.log('park_name, table参数不正确'); reject(); return ; }
                            //console.log('message:', message,park_name )
                            let result = await ctx.service.company.initCompanies(park_name, table , companies )
                            if(result.err) {console.log(result.err); reject(result.err); return ; }
                            resolve()

                        } catch(error) {
                            console.log(error)
                            reject(error)
                        }
                        break;

                    case 'companynews': 

                        break;
                        
                    case 'parknews': 

                        break;

                        
                    case 'industrynews': 

                        break;

                    // case '': 
                    //     break;
                }
                
            })
        }

    }




}





// console.log('消费数据 do something:', message.url   )

// const result = await app.curl('http://127.0.0.1:7001/news/test', {
//     // 必须指定 method
//     method: 'POST',
//     // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
//     contentType: 'json',
//     data: {
//         name: '阿里巴巴'
//     },
//     // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
//     dataType: 'json',
// })


// //console.log('result:' , result)
// if(result.status == 200){
//     console.log(result.status, '请求成功：', result.data)
//     //ctx.service.company.initCompanyInfo()

//     resolve()
// } else {
//     //console.log('请求失败:', result.status )
//     reject()
// }








