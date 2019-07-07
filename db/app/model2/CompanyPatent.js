module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    companyPatent_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
        
        company_id: INTEGER(11),
  
        name: STRING(200), // 专利名称
        publishedAt: DATEONLY, // 公布日期
        publishApplicationNo: STRING(30), // 申请公布号
        applicationNo: STRING(30), // 申请号
        applicationDate: DATEONLY, // 申请日期
        type: STRING(30), // 专利类别
        agent: STRING(30), // 代理机构
        abstract: STRING(2000), // 摘要
  
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const CompanyPatent = app.devSeq.DevMysqlSeq.define('companyPatent', model, {
    paranoid: true
  })
  CompanyPatent.associate = function() {
    CompanyPatent.belongsTo(app.devModel.Company,{foreignKey:'company_id'})
    // companyPatent.hasMany(app.devModel.User,{foreignKey: 'park_id'})
  
}
CompanyPatent.model = model
  return CompanyPatent
}