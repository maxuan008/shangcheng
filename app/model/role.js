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
    role_id: {    
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    
    company_id: INTEGER(11), 
    name: STRING(200),  //角色名

    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE
  }

  const Role = app.model.define('role', model, {
    paranoid: true,
    freezeTableName: true,
    underscored: false,
  })

  Role.associate = function() {
    Role.belongsTo(app.model.Company, { foreignKey: 'company_id' })
    Role.hasMany(app.model.Rolefun, { foreignKey: 'role_id' })
    Role.hasMany(app.model.Userassociate, { foreignKey: 'role_id' })
  }
  Role.model = model
  return Role
}
