module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    companyEmployees_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
  
        company_id:INTEGER(11),
        name:STRING(100),
        position :INTEGER(2), //含义：职位
    
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const CompanyEmployees = app.devSeq.DevMysqlSeq.define('companyEmployees', model, {
    paranoid: true
  })
  CompanyEmployees.associate = function() {
    CompanyEmployees.belongsTo(app.devModel.Company,{foreignKey:'company_id'})
    // companyEmployees.hasMany(app.devModel.User,{foreignKey: 'park_id'})
  
}
CompanyEmployees.model = model
  return CompanyEmployees
}