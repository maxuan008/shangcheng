'use strict'
const co = require('co')

module.exports = {
  up: co.wrap(function* (db, Sequelize) {
      
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */

      const {TINYINT,JSON,TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING, BIGINT , FLOAT } = Sequelize

      yield db.createTable('group', {  //集团 
        group_id: {    
          type: INTEGER(11),
          primaryKey: true,
          autoIncrement: true
        },

        name: STRING(300),  
        profile: TEXT,
        isUse: {type:INTEGER(3) , defaultValue: 1 } ,  //是否禁用, 0禁用  1启用

        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
      })


      yield db.createTable('company', {  //公司 
        company_id: {    
          type: INTEGER(11),
          primaryKey: true,
          autoIncrement: true
        },
        
        group_id: INTEGER(11),  
        name: STRING(300) ,         //公司名
        profile: TEXT,          //简介
        address:STRING(300),    //地址
        tel:STRING(30),         //联系电话
        email:STRING(100),       //邮箱

        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
      })


      yield db.createTable('department', {   //部门
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
      })

      yield db.createTable('user', {  //用户,员工
        user_id: {    
          type: INTEGER(11),
          primaryKey: true,
          autoIncrement: true
        },
        
        name:     STRING(100),  //姓名
        headUrl:  STRING(150),  //头像
        tel:      STRING(30),
        account:  STRING(30),
        password: STRING(70),
        salt:     STRING(70), //盐
        flag: {type:INTEGER(3) , defaultValue: 0  }, // -1超管(集团级别操作),  -2:集团用户管理员 ---》管理登录界面  ;   1.企业管理员 , 2:角色用户 ---》用户登录界面.
        group_id:INTEGER(11), //当flag：-2集团管理员时使用
        contact:  STRING(30),  //联系方式,注册时直接复制过来
        
        isPassChange: {type:INTEGER(3) , defaultValue: 0  }, //密码是否更改       //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
      })

      yield db.createTable('role', {   //角色
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
      })

      yield db.createTable('userassociate', {  //用户多关联表: 一个用户可以在多个的公司中的多个部门中任职不同的角色
        userassociate_id: {    
          type: INTEGER(11),
          primaryKey: true,
          autoIncrement: true
        },
        
        company_id: INTEGER(11),
        department_id: INTEGER(11),
        user_id: INTEGER(11),
        role_id: INTEGER(11),
        isauditing: {type:INTEGER(3) , defaultValue: 0  }, //是否审核 

        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
      })  

      yield db.createTable('fun', {   //功能菜单
        fun_id: {    
          type: INTEGER(11),
          primaryKey: true,
          autoIncrement: true
        },
      
        group_id: INTEGER(11), 
        father_id: INTEGER(11),      //上级部门的fun_id, 如果没有上级部门则为：-1
        name: STRING(100),          //菜单名
        devname: STRING(30),       //开发标记
        router: STRING(300),       //开发时的路由API

        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
      })
      
      yield db.createTable('companyfun', {   //公司的功能菜单：一个公司下的菜单只能是选择集团旗下菜单
        companyfun_id: {    
          type: INTEGER(11),
          primaryKey: true,
          autoIncrement: true
        },
      
        fun_id: INTEGER(11), 
        company_id: INTEGER(11),      

        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
      })
      
      yield db.createTable('rolefun', {   //角色在公司的菜单权限: 一个角色可以有多个公司菜单, 一个公司菜单也可以授予不同的角色
        rolefun_id: {    
          type: INTEGER(11),
          primaryKey: true,
          autoIncrement: true
        },
      
        companyfun_id: INTEGER(11), 
        role_id: INTEGER(11),      
        isUse:  {type:INTEGER(3) , defaultValue: 1  } ,  //是否禁用, 0禁用  1启用

        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
      })



  }) ,
    
  down: async function (db, Sequelize) {
      /*
        Add reverting commands here.
        Return a promise to correctly handle asynchronicity.

        Example:
        return queryInterface.dropTable('users');
      */
              
      await db.dropTable('group')
      await db.dropTable('company')
      await db.dropTable('department')
      await db.dropTable('user')
      await db.dropTable('role')
      await db.dropTable('userassociate')
      await db.dropTable('fun')
      await db.dropTable('companyfun')
      await db.dropTable('rolefun')

  }

}






