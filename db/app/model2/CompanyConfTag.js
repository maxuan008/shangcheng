module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    companyConfTag_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
    
        confTag_id:INTEGER(11),
        company_id:INTEGER(11),
    
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const CompanyConfTag = app.devSeq.DevMysqlSeq.define('companyConfTag', model, {
    paranoid: true
  })
  CompanyConfTag.associate = function() {
    CompanyConfTag.belongsTo(app.devModel.Company,{foreignKey:'company_id'})
    CompanyConfTag.belongsTo(app.devModel.ConfTag,{foreignKey:'confTag_id'})
    // companyConfTag.hasMany(app.devModel.User,{foreignKey: 'park_id'})
  
}
CompanyConfTag.model = model
  return CompanyConfTag
}