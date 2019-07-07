module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    companyFinancing_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
     },
    
      company_id: INTEGER(11),

      when: DATEONLY, // 时间
      round: STRING(10), // 轮次
      assessment: STRING(30), // 估值
      amount: STRING(30), // 金额
      ratio: DECIMAL(10,5), // 比例,
      investor: STRING(30), // 投资方
      newsSource: STRING(30), // 新闻来源
  
      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const CompanyFinancing = app.devSeq.DevMysqlSeq.define('companyFinancing', model, {
    paranoid: true
  })
  CompanyFinancing.associate = function() {
    CompanyFinancing.belongsTo(app.devModel.Company,{foreignKey:'company_id'})
    // companyFinancing.hasMany(app.devModel.User,{foreignKey: 'park_id'})
  
}
CompanyFinancing.model = model
  return CompanyFinancing
}