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
    isUse:  {type:INTEGER(3) , defaultValue: 1  } ,  //是否禁用, 0禁用  1启用

    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE
  }

  const Rolefun = app.model.define('rolefun', model, {
    paranoid: true,
    freezeTableName: true,
    underscored: false,
  })

  Rolefun.associate = function() {
    Rolefun.belongsTo(app.model.Role, { foreignKey: 'role_id' })
    Rolefun.belongsTo(app.model.Companyfun, { foreignKey: 'companyfun_id' })
  }
  Rolefun.model = model
  return Rolefun
}
