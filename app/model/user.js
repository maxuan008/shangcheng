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
    
    name:     STRING(100),  //姓名 
    headUrl:  STRING(150), 
    tel:      STRING(30),  //手机号
    account:  STRING(30),  //账号
    email:    STRING(80),  //email
    password: STRING(70),
    salt:     STRING(70), //盐
    flag: {type:INTEGER(3) , defaultValue: 0  }, // -1超管(集团级别操作),  -2:集团用户管理员 ---》管理登录界面  ;   1.企业管理员 , 2:角色用户 ---》用户登录界面.
    group_id:INTEGER(11), //当flag：-2集团管理员时使用
    isPassChange: {type:INTEGER(3) , defaultValue: 0  }, //密码是否更改
    
    contact:  STRING(30),  //联系方式,注册时直接复制过来

    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE
  }

  const User = app.model.define('user', model, {
    paranoid: true,
    freezeTableName: true,
    underscored: false,
  })

  User.associate = function() {
    //User.belongsTo(app.model.Company, { foreignKey: 'company_id' })
    User.hasMany(app.model.Userassociate, { foreignKey: 'user_id' })
  }
  User.model = model
  return User
}
