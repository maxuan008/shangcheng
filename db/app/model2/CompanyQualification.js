module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    companyQualification_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
        
        company_id:INTEGER(11),
        confQualification_id: INTEGER(11),
        //name: STRING(100), //服务资质名称
        url: STRING(200),      //文件地址
    
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const CompanyQualification = app.devSeq.DevMysqlSeq.define('companyQualification', model, {
    paranoid: true
  })
  CompanyQualification.associate = function() {
    // companyQualification.hasMany(app.devModel.User,{foreignKey: 'park_id'})
    CompanyQualification.belongsTo(app.devModel.Company,{foreignKey:'company_id'})
    CompanyQualification.belongsTo(app.devModel.ConfQualification,{foreignKey:'confQualification_id'})
}
CompanyQualification.model = model
  return CompanyQualification
}