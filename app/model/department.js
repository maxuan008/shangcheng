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
    department_id: {    
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
  
    company_id: INTEGER(11), 
    father_id: {type:INTEGER(11) , defaultValue: -1  },     //上级部门的department_id, 如果没有上级部门则为：-1
    name: STRING(300),       //部门名

    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE
  }

  const Department = app.model.define('department', model, {
    paranoid: true,
    freezeTableName: true,
    underscored: false,
  })

  Department.associate = function() {
    Department.belongsTo(app.model.Company, { foreignKey: 'company_id' })
    Department.hasMany(app.model.Userassociate, { foreignKey: 'department_id' })

  }
  Department.model = model
  return Department
}
