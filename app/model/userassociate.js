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
    department_id: INTEGER(11),
    user_id: INTEGER(11),
    role_id: INTEGER(11),
    isauditing: {type:INTEGER(3) , defaultValue: 0  }, //是否审核

    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE
  }

  const Userassociate = app.model.define('userassociate', model, {
    paranoid: true,
    freezeTableName: true,
    underscored: false,
  })

  Userassociate.associate = function() {
    Userassociate.belongsTo(app.model.Company, { foreignKey: 'company_id' })
    Userassociate.belongsTo(app.model.User, { foreignKey: 'user_id' })
    Userassociate.belongsTo(app.model.Department, { foreignKey: 'department_id' })
    Userassociate.belongsTo(app.model.Role, { foreignKey: 'role_id' })

  }
  Userassociate.model = model
  return Userassociate
}
