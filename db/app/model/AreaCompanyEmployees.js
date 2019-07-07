module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

      areaCompanyEmployees_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
  
        areaCompany_id:INTEGER(11),
        name:STRING(100),
        position :INTEGER(2), //含义：职位
    
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const AreaCompanyEmployees = app.model.define('areaCompanyEmployees', model, {
    paranoid: true
  })
  AreaCompanyEmployees.associate = function() {
    AreaCompanyEmployees.belongsTo(app.pgModel.AreaCompany,{foreignKey:'areaCompany_id'})
    // companyEmployees.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
  
}
AreaCompanyEmployees.model = model
  return AreaCompanyEmployees
}