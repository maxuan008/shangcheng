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

  const CompanyConfTag = app.model.define('companyConfTag', model, {
    paranoid: true
  })
  CompanyConfTag.associate = function() {
    CompanyConfTag.belongsTo(app.pgModel.Company,{foreignKey:'company_id'})
    CompanyConfTag.belongsTo(app.pgModel.ConfTag,{foreignKey:'confTag_id'})
    // companyConfTag.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
  
}
CompanyConfTag.model = model
  return CompanyConfTag
}