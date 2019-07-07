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
    fun_id: {    
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
  
    group_id: INTEGER(11), 
    father_id: {type:INTEGER(11) , defaultValue: -1  },        //上级部门的fun_id, 如果没有上级部门则为：-1
    name: STRING(100),          //菜单名
    devname: STRING(30),       //开发标记
    router: STRING(300),       //开发时的路由API

    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE
  }

  const Fun = app.model.define('fun', model, {
    paranoid: true,
    freezeTableName: true,
    underscored: false,
  })

  Fun.associate = function() {
    Fun.belongsTo(app.model.Group, { foreignKey: 'group_id' })
    //Fun.hasMany(app.model.Companyfunview, { foreignKey: 'companyfun_id' })

  }
  Fun.model = model
  return Fun
}
