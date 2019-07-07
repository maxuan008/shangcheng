//通用模板----查询
POST
url:  /api/factory/search
body ： 
    mapflag: 'grp' //映射表
    dims:{name: '名称'}  //模糊匹配
    equs:{isUse:1}   //精确匹配,
    exclude:['isValid', 'createdAt', 'deletedAt']
    page , pageSize //非必选： 
    order:[['name','DESC']]
res:
{
    status:200,  //403 非法访问  ,404 失败 , 405 未登录
    msg:'sucess',
    err:'',
    docs:[  //数据结构为表的结构
        {
        }
    ]
}



//-----创建
POST
url:  /api/factory/add  会查看映射表去重条件distant ,不存在 直接创建。存在, 
body :
    mapflag:'grp'   //映射表 group
    data:{
        name:'名称'
    }
res:
{
    status:200,  //403 非法访问  ,404 失败 , 405 未登录
    msg:'sucess',
    err:''
}

//-----更新 : 更新时，会查看映射表去重条件distant ， 不存在 直接更新。 存在,查看去重数据(如有外键，加入外键去重)， 去重数据 为空 ：直接更新， 不为空： 检查去重。
POST
url:  /api/factory/update 
body :
    mapflag:1 //映射表 1:group
    keys:{group_id: 1}  //必选
    data:{
        name:'名称'
    }
res:
{
    status:200,  //403 非法访问  ,404 失败 , 405 未登录
    msg:'sucess',
    err:''
}

//-----删除
POST
url:  /api/factory/destroy
body :
    mapflag:1 //映射表 1:group
    keys:{group_id: 1}  //必选
res:
{
    status:200,  //403 非法访问  ,404 失败 , 405 未登录
    msg:'sucess',
    err:''
}


