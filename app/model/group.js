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
    group_id: {    
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },

    name: STRING(300),  
    profile: TEXT,
    isUse: {type:INTEGER(3) , defaultValue: 1  } ,  //是否禁用, 0禁用  1启用

    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE
  }

  const Group = app.model.define('group', model, {
    paranoid: true,
    freezeTableName: true,
    underscored: false,
  })

  Group.associate = function() {
    Group.hasMany(app.model.Company, { foreignKey: 'group_id' })
    Group.hasMany(app.model.Fun, { foreignKey: 'group_id' })

  }
  Group.model = model
  return Group
}
