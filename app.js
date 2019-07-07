const path = require('path')
const fs = require('fs')


class AppBootHook {
    constructor(app) {
        this.app = app;

        app.loader.loadToApp(path.join(app.baseDir, './elc'), 'elc', {
            inject: app,
            caseStyle: 'upper',
            ignore: 'index.js'
        })

        app.loader.loadToApp(path.join(app.baseDir, './mq'), 'mq', {
            inject: app,
            caseStyle: 'upper',
            ignore: 'index.js'
        })


    }
  
    configWillLoad() {
      // Ready to call configDidLoad,
      // Config, plugin files are referred,
      // this is the last chance to modify the config.
    }
  
    configDidLoad() {
      // Config, plugin files have been loaded.
    }
  
    async didLoad() {
      // All files have loaded, start plugin here.
    }
  
    async willReady() {
      // All plugins have started, can do some thing before app ready

      let self = this.app, ctx = this.app.createAnonymousContext()


      for (const name of Object.keys(self['model'])) {
        //console.log(name)
        const klass = self['model'][name]
        const lowerName = name.toLowerCase().replace(/^[\s\S]/, v => v.toUpperCase())
        self['model'][lowerName] = klass
      }

      //let userass = await this.app.model.Userassociate.findAll()
      console.log('插件启动完毕',this.app.model.Group)

      
      let rootPath =  path.join (__dirname, './consumer') , consumers = fs.readdirSync( rootPath)
      console.log('rootPath:' , rootPath )
      consumers.map(v => {
            let q =  v.replace(/.js/, '')
            //console.log(v ) 
            if(q){
                this.app.mq.Client.then( (ch) => {
                    return ch.assertQueue(q).then(function(ok) {
                        console.log("启动消费：" ,q)
                        return ch.consume(q,  function(msg) {
                            if (msg !== null) {
                                //console.log('消费数据',msg.content.toString());
                                ch.ack(msg);
                                let jsFile =  path.join( rootPath, v )
                                require(jsFile)( self,ctx , msg).task().then(()=>{
                                    console.log('删除消息')
                                    //ch.ack(msg); 
                                }, (err)=> {
                                    console.log('执行失败：', err )
                                    //ch.ack(msg);
                                })
                                
                            }
                        });
                    })
                })

            }
          
      })


    }
  
    async didReady() {
      // Worker is ready, can do some things
      // don't need to block the app boot.

    }
  
    async serverDidReady() {


    }
  
    async beforeClose() {
      // Do some thing before app close.
    }
  }
  
  module.exports = AppBootHook;

