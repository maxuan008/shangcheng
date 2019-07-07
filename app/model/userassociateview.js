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
    userassociate_id: {    
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    
    company_id: INTEGER(11),
    companyName : STRING(300) , 

    department_id: INTEGER(11),
    departmentName: STRING(300),  

    user_id: INTEGER(11),
    userName: STRING(300),  
    headUrl:  STRING(150), 
    tel:      STRING(30),  //手机号
    account:  STRING(30),  //账号

    role_id: INTEGER(11),
    roleName: STRING(300), 

    isauditing: {type:INTEGER(3) , defaultValue: 0  }, //是否审核

    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE
  }

  const UserassociateView = app.model.define('userassociateview', model, {
    paranoid: true,
    freezeTableName: true,
    underscored: false,
  })

  UserassociateView.associate = function() {
    UserassociateView.belongsTo(app.model.Company, { foreignKey: 'company_id' })
    UserassociateView.belongsTo(app.model.User, { foreignKey: 'user_id' })
    UserassociateView.belongsTo(app.model.Department, { foreignKey: 'department_id' })
    UserassociateView.belongsTo(app.model.Role, { foreignKey: 'role_id' })

  }
  UserassociateView.model = model
  return UserassociateView
}
