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
    rolefun_id: {    
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
  
    companyfun_id: INTEGER(11), 
    role_id: INTEGER(11),  
    roleName: STRING(300) ,  //
    isUse:  {type:INTEGER(3) , defaultValue: 1  } ,  //是否禁用, 0禁用  1启用


    fun_id: INTEGER(11), 
    funName:  STRING(300) ,     //菜单名
    devname: STRING(30),       //开发标记
    router: STRING(300),       //开发时的路由API

    company_id: INTEGER(11),      
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

  const RolefunView = app.model.define('rolefunview', model, {
    paranoid: true,
    freezeTableName: true,
    underscored: false,
  })

  RolefunView.associate = function() {
    RolefunView.belongsTo(app.model.Role, { foreignKey: 'role_id' })
    RolefunView.belongsTo(app.model.Companyfun, { foreignKey: 'companyfun_id' })
  }
  RolefunView.model = model
  return RolefunView
}
