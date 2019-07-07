module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    companyNeed_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
  
        company_id:INTEGER(11),
  
        details:TEXT,   // 描述
  
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const CompanyNeed = app.devSeq.DevMysqlSeq.define('companyNeed', model, {
    paranoid: true
  })
  CompanyNeed.associate = function() {
    CompanyNeed.belongsTo(app.devModel.Company,{foreignKey:'company_id'})
    // companyFinancing.hasMany(app.devModel.User,{foreignKey: 'park_id'})
  
}
CompanyNeed.model = model
  return CompanyNeed
}