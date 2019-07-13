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

  const Company = app.model.define('company', model, {
    paranoid: true,
    freezeTableName: true,
    underscored: false,
  })

  Company.associate = function() {
    Company.belongsTo(app.model.Group, { foreignKey: 'group_id' })
    Company.hasMany(app.model.Role, { foreignKey: 'company_id' })
    //Company.hasMany(app.model.User, { foreignKey: 'company_id' })
    Company.hasMany(app.model.Department, { foreignKey: 'company_id' })
    Company.hasMany(app.model.Userassociate, { foreignKey: 'company_id' })

    // Company.belongsToMany(app.model.Conf, {
    //   through: 'companyConf',
    //   foreignKey: 'company_id',
    // })
    



  }

  Company.model = model
  return Company
}
