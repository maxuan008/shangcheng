{   //==== 1.查询，创建，禁用一个集团
        
        POST  //--查询
        url:  /api/factory/search
        body ：  
        {
            "mapflag":"grp",
            "attributes":["group_id","isUse"],
            "exclude":["createdAt", "updatedAt", "deletedAt"],
            "equs":{isUse:1},              //精确匹配,
            "dims":{name: '集团'},         //模糊匹配
            "page":1 ,
            "pageSize":10 ,           //非必选： 
            "order":[['name','DESC']]    //非必选
        }

        res:
        {
            status:200,  //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess',
            datas:[
                {
                    group_id:INTEGER(11),
                    name: STRING(300),  
                    profile: TEXT,
                    isUse: {type:INTEGER(3) , defaultValue: 1 } 
                }
            ]
        }


        POST     //---创建
        url:  /api/factory/add
        body :{
            "mapflag":"grp",   //映射表 group
            "data":{
                "name":'名称'
            }           
        }

        res:
            {
                status:200,  //403 非法访问  ,404 失败 , 405 未登录
                msg:'sucess'
                data:{
                    group_id
                }
            }



        POST  //--更新
        url:  /api/factory/update
        body :
            "mapflag":"grp", //映射表 group
            "keys":{"group_id": 1},  //必选
            distinct: {"name":'集团2'},  //非必选：更新的去重条件
            "data":{
                "name":"集团2",
                "profile":"集团简介"
            }
            res:
            {
                status:200,   //403 非法访问  ,404 失败 , 405 未登录
                msg:'sucess',
                err:''
            }



        POST  //---禁用一个集团
        url:  /api/factory/destroy
        body :
            "mapflag":"grp", //映射表 group
            "keys":{"group_id": 1},  //必选
        res:
        {
            status:200,  //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess',
            err:''
        }


}


{  //===== 2.集团下操作菜单功能

    POST  //----查询集团全部菜单
    url:  /api/factory/search
    body ：
    {
        "mapflag":"f",
        "equs":{"group_id":1}         
    } 

    res:
    {
        status:200,  //403 非法访问  ,404 失败 , 405 未登录
        msg:'sucess',
        datas:[
            {
                fun_id: {    
                    type: INTEGER(11),
                    primaryKey: true,
                    autoIncrement: true
                },
                
                group_id: INTEGER(11), 
                father_id: INTEGER(11),     //上级部门的fun_id, 如果没有上级部门则为：-1
                name: STRING(100),          //菜单名
                devname: STRING(30),        //开发标记
                router: STRING(300),        //开发时的路由API
            }
        ]
    }
    
    
    
    POST     //--- 菜单 -- 创建
    url:  /api/factory/add
    body :
    {
        "mapflag":"f",
        "data":{
            "group_id": 1, 
            "father_id": -1 ,            //上级部门的fun_id, 如果没有上级部门则为：-1
            "name": "项目管理",          //菜单名
            "devname": "prjManger",              //开发标记
            "router": "/prj/",       //开发时的路由API
        }    
    } 
    res:
        {
            status:200,  //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess'
            data:{
                fun_id
            }
        }
    
    
    
    
    POST  // 菜单 -- 更新
    url:  /api/factory/update
    body :
    {
        "mapflag":"f",
        "keys":{"fun_id": 3} ,
        "data":{
            "father_id": 1,      
            "name": "项目管理2",      
            "devname": "aa",    
            "router": "bb"     
        }    
    } 
        res:
        {
            status:200,   //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess',
            err:''
        }
    
    
   POST  // 菜单 -- 删除
        url:  /api/factory/destroy
        body :
        {
            "mapflag":"f",
            "keys":{"fun_id": 1}  //必选 
        }
        res:
        {
            status:200,  //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess',
            err:''
        }

}


{  //===== 3.集团的公司操作

    POST  //----查询公司
    url:  /api/factory/search
    body ： 
    {
        "mapflag":"comy",
        "equs":{"group_id":1} ,         //精确匹配
        "exclude":["isValid", "createdAt", "deletedAt"]
    }

    res:
        {
            status:200,  //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess',
            datas:[
                {
                    company_id: {    
                        type: INTEGER(11),
                        primaryKey: true,
                        autoIncrement: true
                    },
                    
                    group_id: INTEGER(11),  
                    name: STRING(300) ,       //公司名
                    profile: TEXT,            //简介
                    address:STRING(300),      //地址
                    tel:STRING(30),           //联系电话
                    email:STRING(100),        //邮箱
                
                    createdAt: DATE,
                    updatedAt: DATE,
                    deletedAt: DATE
                }
            ]
        }
    
    
    
    POST     //---创建公司
    url:  /api/factory/add
    body :
    {
        "mapflag":"comy",   //映射表 company
        "data":{
            "group_id": INTEGER(11),  
            "name": STRING(300) ,       //公司名
            "profile": TEXT,            //简介
            "address":STRING(300),      //地址
            "tel":STRING(30),           //联系电话
            "email":STRING(100),        //邮箱
        
        }
    }

    res:
        {
            status:200,  //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess'
            data:{
                company_id
            }
        }
    
    
    
    
    POST  //更新公司
    url:  /api/factory/update
    body :
    {
        "mapflag":"comy",                   //映射表 company
        "keys":{"company_id": 1} ,            //必选
        "data":{
            "group_id": INTEGER(11),  
            "name": STRING(300) ,       //公司名
            "profile": TEXT,            //简介
            "address":STRING(300),      //地址
            "tel":STRING(30),           //联系电话
            "email":STRING(100),        //邮箱
        },
    }

    res:
        {
            status:200,   //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess',
            err:''
        }
    

    
    
    POST  //---删除公司
    url:  /api/factory/destroy
    body :
    {
        "mapflag":"comy", //映射表 group
        "keys":{"company_id": 1}  //必选
    }

    res:
    {
        status:200,  //403 非法访问  ,404 失败 , 405 未登录
        msg:'sucess',
        err:''
    }



}



{  //===== 4.公司下角色操作

    POST  //----查询角色
    url:  /api/factory/search
    body ： 
    {
        "mapflag":"ro",   
        "equs":{"company_id":1}           //精确匹配
        "exclude":["isValid", "createdAt", "deletedAt"]
    }

    res:
        {
            status:200,  //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess',
            datas:[
                {
                    role_id: {    
                        type: INTEGER(11),
                        primaryKey: true,
                        autoIncrement: true
                      },
                      
                      company_id: INTEGER(11), 
                      name: STRING(200),  //角色名
                  
                      createdAt: DATE,
                      updatedAt: DATE,
                      deletedAt: DATE
                }
            ]
        }
    
    
    
    POST     //--- 角色--创建
    url:  /api/factory/add
    body :
    {
        "mapflag":"ro",
        "data":{
            "company_id": 1, 
            "name": "角色1"
        }       
    }

    res:
        {
            status:200,  //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess'
            data:{
                role_id
            }
        }
    
    
    
    
    POST  //角色 -- 更新
    url:  /api/factory/update
    body :
    {
        "mapflag":"ro",                      //映射表 role
        "keys":{ "role_id": 1},             //必选
        "data":{
            "name": "角色名" //角色名
        }
    }

    res:
        {
            status:200,   //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess',
            err:''
        }
    

    
    
    POST  //--- 角色 -- 删除
    url:  /api/factory/destroy
    body :
    {
        "mapflag":"ro", //映射表 role
        "keys":{"role_id": 1}  //必选
    }

    res:
    {
        status:200,  //403 非法访问  ,404 失败 , 405 未登录
        msg:'sucess',
        err:''
    }


}



{  //===== 5.公司下 部门 操作

    POST  //----查询部门
    url:  /api/factory/search
    body ： 
    {
        "mapflag":"dp",   
        "equs":{"company_id":1}           //精确匹配
        "exclude":["isValid", "createdAt", "deletedAt"]
    }

    res:
        {
            status:200,  //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess',
            datas:[
                {
                    department_id: {    
                        type: INTEGER(11),
                        primaryKey: true,
                        autoIncrement: true
                      },            
                      company_id: INTEGER(11), 
                      father_id: INTEGER(11),   //上级部门的department_id, 如果没有上级部门则为：-1
                      name: STRING(300),       //部门名
                  
                      createdAt: DATE,
                      updatedAt: DATE,
                      deletedAt: DATE
                }
            ]
        }
    
    
    
    POST     //--- 部门--创建
    url:  /api/factory/add
    body :
    {
        "mapflag":"dp",
        "data":{
            "company_id": 1, 
            "father_id": -1,
            "name": "部门1"
        }       
    }

    res:
        {
            status:200,  //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess'
            data:{
                role_id
            }
        }
    
    
    
    
    POST  //部门 -- 更新
    url:  /api/factory/update
    body :
    {
        "mapflag":"dp",                      //映射表 department
        "keys":{ "department_id": 1},             //必选
        "data":{
            "name": "部门2" // 部门 名
        }
    }

    res:
        {
            status:200,   //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess',
            err:''
        }
    

    
    
    POST  //--- 部门 -- 删除 
    url:  /api/factory/destroy
    body :
    {
        "mapflag":"dp", //映射表 department
        "keys":{"department_id": 1}  //必选
    }

    res:
    {
        status:200,  //403 非法访问  ,404 失败 , 405 未登录
        msg:'sucess',
        err:''
    }


}


{  //===== 6.公司关联菜单的操作

    POST  //---初始化企业的菜单
          //----1.如果菜单不在companyfun中：创建。 
          //----2.创建一个菜单的时候自动初始化到每个公司
          //----3.创建一个企业时,自动初始化菜单


    POST  //----查询公司关联菜单
    url:  /api/admin/searchcompanfun
    body : 
    {
        company_id
    }
   
    res:
    {
        status:200,  //403 非法访问  ,404 失败 , 405 未登录
        msg:'sucess',
        datas:[  //代码中确定
            {
                companyfun_id:  INTEGER(11), 
  
                fun_id: INTEGER(11), 
                company_id: INTEGER(11),      
                funName:  STRING(300) ,     //菜单名
                companyName: STRING(300) ,  //
                
                group_id:  INTEGER(11), 
                groupName: STRING(300),   
            
                father_id: INTEGER(11),      //上级部门的fun_id, 如果没有上级部门则为：-1
                devname: STRING(30),       //开发标记
                router: STRING(300),       //开发时的路由API 

            }
        ]
    }
    
    
    
    POST     //---创建企业关联菜单
    url:  /api/factory/add
    body :
    {
        "mapflag":"comfun",    //映射表 企业菜单
        "data":
            {
                "fun_id":1,
                "company_id":1, 
                "isUse":1
            }
    }
    res:
        {
            status:200,  //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess'
            data:{
                companyfun_id
            }
        }
    
    
   


    POST  //企业关联菜单 设置是否可以用
    url:  /api/factory/update
    body :
    {
        "mapflag":"comfun",                     //
        "keys":{ "companyfun_id":1 },          //必选
        "data":{
            "isUse"：0, 1
        }
    }

    res:
        {
            status:200,   //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess',
            err:''
        }

    
        POST  //--- 企业关联菜单 -- 删除 
        url:  /api/factory/destroy
        body :
        {
            "mapflag":"comfun", //映射表 department
            "keys":{"companyfun_id": 4}  //必选
        }
    
        res:
        {
            status:200,  //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess',
            err:''
        }


}








//===================================================================


{  //===== 7.设置角色的菜单的权限

    POST  //---初始化角色的菜单
          //----1.
          //----2.
          //----3.



    POST  //角色菜单设置  是否禁用
    url:  /api/factory/update
    body :
    {
        "mapflag":"comfun",                     //
        "keys":{ "companyfun_id":1 },          //必选
        "data":{
            "isUse"：0, 1
        }
    }

    res:
        {
            status:200,   //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess',
            err:''
        }

    

    
    
   
   



}




{  //===== 5.公司下用户操作

    POST  //----查询用户
    url:  /api/admin/searchCompanyUsers
    body ： 
    {
        company_id,  //必选
        role_id,  //非必选
    }

    res:
    {
        status:200,  //403 非法访问  ,404 失败 , 405 未登录
        msg:'sucess',
        datas:[  //代码中确定
            {
                company_id,
                company_name,
                department_id,
                department_name,
                role_id,
                role_name,

            }
        ]
    }
    
    
    
    POST     //---创建公司用户
    url:  /api/admin/addCompanyUser
    body :
        {   
            tel(新建场景) or user_id( 用户选择场景 ),               //必选
            name(用户名-新建场景)
            company_id: INTEGER(11), 
            department_id: INTEGER(11),
            role_id: INTEGER(11),
        }
    res:
        {
            status:200,  //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess'
            data:{
                userassociate_id,
                user_id
            }
        }
    
    
    
    
    POST  //更新用户信息
    url:  /api/factory/update
    body :
        mapflag:'user'                //
        keys:{user_id: 1}             //必选
        data:{
            name: STRING(200),  
            isPassChange: {type:INTEGER(2) , defaultValue: 0  }, //密码是否更改
        },
    res:
        {
            status:200,   //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess',
            err:''
        }
    


    POST  //更改用户的角色, 部门或公司
    url:  /api/factory/update
    body :
        mapflag:'uasso'                       //
        keys:{ userassociate_id:1 }           //必选
        data:{
            company_id: INTEGER(11),
            department_id: INTEGER(11),
            role_id: INTEGER(11),
        },
    res:
        {
            status:200,   //403 非法访问  ,404 失败 , 405 未登录
            msg:'sucess',
            err:''
        }



    
    
    POST  //---删除公司用户
    url:  /api/factory/destroy
    body :
        mapflag:'uasso' //映射表 role
        keys:{userassociate_id: 1}  //必选
    res:
    {
        status:200,  //403 非法访问  ,404 失败 , 405 未登录
        msg:'sucess',
        err:''
    }






}










// {  //===== 5. 用户 操作

//     POST  //----查询用户
//     url:  /api/factory/search
//     body ： 
//     {
//         "mapflag":"ur",   
//         "equs":{"company_id":1}           //精确匹配
//         "exclude":["updatedAt", "createdAt", "deletedAt"]
//     }

//     res:
//         {
//             status:200,  //403 非法访问  ,404 失败 , 405 未登录
//             msg:'sucess',
//             datas:[
//                 {
//                     user_id: {    
//                         type: INTEGER(11),
//                         primaryKey: true,
//                         autoIncrement: true
//                       },
//                     name:     STRING(100),  //姓名 
//                     headUrl:  STRING(150), 
//                     tel:      STRING(30),  //手机号
//                     account:  STRING(30),  //账号
                  
//                       createdAt: DATE,
//                       updatedAt: DATE,
//                       deletedAt: DATE
//                 }
//             ]
//         }
      

//     POST     //--- 用户 -- 创建
//     url:  /api/factory/add
//     body :
//     {

//     }

//     res:
//         {
//             status:200,  //403 非法访问  ,404 失败 , 405 未登录
//             msg:'sucess'
//             data:{
//                 role_id
//             }
//         }
    
    
    
    
//     POST  //用户 -- 更新
//     url:  /api/factory/update
//     body :
//     {
//         "mapflag":"dp",                      //映射表 department
//         "keys":{ "department_id": 1},             //必选
//         "data":{
//             "name": "部门2" // 部门 名
//         }
//     }

//     res:
//         {
//             status:200,   //403 非法访问  ,404 失败 , 405 未登录
//             msg:'sucess',
//             err:''
//         }
    

    
    
//     POST  //--- 用户-- 删除 
//     url:  /api/factory/destroy
//     body :
//     {
//         "mapflag":"dp", //映射表 department
//         "keys":{"department_id": 1}  //必选
//     }

//     res:
//     {
//         status:200,  //403 非法访问  ,404 失败 , 405 未登录
//         msg:'sucess',
//         err:''
//     }


// }



