{   //==== 1.超管登陆
        POST  
        url:  /api/admin/login,
        body :  
        {
            tel:'123333333',
            password:'22222222'
        }
        //后台生成session数据
        // userInfo:{
        //     user_id,
        //     name:     STRING(100),  //姓名 
        //     headUrl:  STRING(150), 
        //     tel:      STRING(30),  //手机号
        //     account:  STRING(30),  //账号
        //     flag: {type:INTEGER(3) , defaultValue: 0  }  
        // }
        res:
        {
            status:200,  //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess'
        }


        Get     //---获取session数据
        url:  /api/admin/sessioninfo
        res:
            {
                status:200,  //403 非法访问  ,404 失败 , 405 未登录
                msg:'sucess'
                datas:{
                    userInfo:{
                        user_id,
                        name:     STRING(100),  //姓名 
                        headUrl:  STRING(150), 
                        tel:      STRING(30),  //手机号
                        account:  STRING(30),  //账号
                        flag: {type:INTEGER(3) , defaultValue: 0  }  
                    }
                }
            }
