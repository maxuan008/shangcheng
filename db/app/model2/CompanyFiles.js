module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    companyFiles_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
        
        company_id:INTEGER(11),
        confCompanyInfoType_id: INTEGER(11),
        //name: STRING(100), //服务资质名称
        url: STRING(200),      //文件地址
    
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const CompanyFiles = app.devSeq.DevMysqlSeq.define('companyFiles', model, {
    paranoid: true
  })
  CompanyFiles.associate = function() {
    CompanyFiles.belongsTo(app.devModel.Company,{foreignKey:'company_id'})
    CompanyFiles.belongsTo(app.devModel.ConfCompanyInfoType,{foreignKey:'confCompanyInfoType_id'})
    // companyFiles.hasMany(app.devModel.User,{foreignKey: 'park_id'})
  
}
CompanyFiles.model = model
  return CompanyFiles
}