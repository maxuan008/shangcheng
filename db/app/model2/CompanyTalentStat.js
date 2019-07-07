module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    companyTalentStat_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
        
        company_id: INTEGER(11),
  
        // 人才信息 -------------------------------------
        year: INTEGER, // 所属年份
        total: INTEGER, // 企业总人数
        rd: INTEGER, // 研发人员
        science: INTEGER, // 科技活动人员
        doctor: INTEGER, // 博士人数
        master: INTEGER, // 硕士人数
        postgraduate: INTEGER, // 研究生人数
        bachelor: INTEGER, // 本科生人数
        overseas: INTEGER, // 留学人数
        college: INTEGER, // 大专生人数
        secondary: INTEGER, // 中专生人数
        internship: INTEGER, // 接纳大学生、研究生实习人员
        freshGraduate: INTEGER, // 接纳应届毕业生就业人员
  
  
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const CompanyTalentStat = app.devSeq.DevMysqlSeq.define('companyTalentStat', model, {
    paranoid: true
  })
  CompanyTalentStat.associate = function() {
    CompanyTalentStat.belongsTo(app.devModel.Company,{foreignKey:'company_id'})
    // companyTalentStat.hasMany(app.devModel.User,{foreignKey: 'park_id'})
    CompanyTalentStat.belongsToMany(app.devModel.ConfTalentPlan,{through:'companyTalentStatAndPlan',foreignKey:'companyTalentStat_id'})
}
CompanyTalentStat.model = model
  return CompanyTalentStat
}