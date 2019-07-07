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
    companyfun_id: {    
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
  
    fun_id: INTEGER(11), 
    company_id: INTEGER(11),      
    funName:  STRING(300) ,     //菜单名
    companyName: STRING(300) ,  //
    
    group_id:  INTEGER(11), 
    groupName: STRING(300),   

    father_id: INTEGER(11),      //上级部门的fun_id, 如果没有上级部门则为：-1
    devname: STRING(30),       //开发标记
    router: STRING(300),       //开发时的路由API 


    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE
  }

  const CompanyfunView = app.model.define('companyfunview', model, {
    paranoid: true,
    freezeTableName: true,
    underscored: false,
  })

  CompanyfunView.associate = function() {
    CompanyfunView.belongsTo(app.model.Company, { foreignKey: 'company_id' })
    CompanyfunView.belongsTo(app.model.Fun, { foreignKey: 'fun_id' })
    // CompanyfunView.hasMany(app.model.Rolefun, { foreignKey: 'companyfun_id' })

  }
  CompanyfunView.model = model
  return CompanyfunView
}
