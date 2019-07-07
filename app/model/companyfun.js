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

    isUse: {type:INTEGER(3) , defaultValue: 0  }, //是否0未使用, 1使用

    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE
  }

  const Companyfun = app.model.define('companyfun', model, {
    paranoid: true,
    freezeTableName: true,
    underscored: false,
  })

  Companyfun.associate = function() {
    Companyfun.belongsTo(app.model.Company, { foreignKey: 'company_id' })
    Companyfun.belongsTo(app.model.Fun, { foreignKey: 'fun_id' })
    Companyfun.hasMany(app.model.Rolefun, { foreignKey: 'companyfun_id' })

  }
  Companyfun.model = model
  return Companyfun
}
