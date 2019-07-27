'use strict'
module.exports = app => {
  const {
    STRING,
    TEXT,
    INTEGER,
    TINYINT,
    BIGINT,
    FLOAT,
    JSON,
    BOOLEAN,
    DATEONLY,
    DATE,
    DECIMAL,
    ARRAY,
     
  } = app.Sequelize

  const model = {
    user_id: {    
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    
    group_id:  INTEGER(11),
    groupname: STRING(100),  //集团名 
    username:  STRING(100),  //姓名 
    headUrl:  STRING(150), 
    tel:      STRING(30),  //手机号
    account:  STRING(30),  //账号
    email:    STRING(80),  //email
    flag: INTEGER(3) , // -1超管(集团级别操作),  -2:集团用户管理员 ---》管理登录界面  ;   1.企业管理员 , 2:角色用户 ---》用户登录界面.
    group_id:INTEGER(11), //当flag：-2集团管理员时使用
    isPassChange: {type:INTEGER(3) , defaultValue: 0  }, //密码是否更改
    contact:  STRING(30),  //联系方式,注册时直接复制过来

    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE,

  }

  const Groupadminview = app.model.define('groupadminview', model, {
    paranoid: true,
    freezeTableName: true,
    underscored: false,
  })

  Groupadminview.associate = function() {

  }
  Groupadminview.model = model
  return Groupadminview
}
