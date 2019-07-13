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
    password: STRING(70),
    salt:     STRING(70), //盐

    isPassChange: {type:INTEGER(3) , defaultValue: 0  }, //密码是否更改
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
