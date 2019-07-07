module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING ,BIGINT} = app.Sequelize

  const model = {

    companyOperation_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
        
        company_id: INTEGER(11),
  
        // 经营信息 -------------------------------------
        year: INTEGER, // 所属年份
        yearlyIncoming: BIGINT, // 本年度总收入
        netProfit: BIGINT, // 净利润
        exportSum: STRING(30), // 出口总额
        yearlyRDFund: BIGINT, // 年度研究与试验发展经费
        taxPayed: BIGINT, // 实际上缴税费
  
        // 国家政策支持 -------------------------------------
        nationalRDProject: INTEGER, // 承担国家科研和产业化项目（项）
        nationalRDFinancing: BIGINT, // 承担国家科研和产业化获得资助（元）
        ProvinceRDProject: INTEGER, // 承担省市区科研开发项目（项）
        ProvinceRDFinancing: BIGINT, // 承担省市区科研开发项目获得资助金额（元）
  
        // 合作的服务机构 -------------------------------------
        businessService: STRING(1500), // 商务服务类
      accountingService: STRING(1500), // 会计服务
      financingService: STRING(1500), // 融资服务
      hrService: STRING(1500), // 人力服务
      projectApplicationService: STRING(1500), // 项目申报
      smeConsultingService: STRING(1500), // 中小企业创业顾问
      publicTechnologyService: STRING(1500), // 公共技术服务平台
      financeIntegrationService: STRING(1500), // 金融集成创新服务
      lifeSupportingService: STRING(1500), // 生活配套服务
  
  
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const CompanyOperation = app.devSeq.DevMysqlSeq.define('companyOperation', model, {
    paranoid: true
  })
  CompanyOperation.associate = function() {
    CompanyOperation.belongsTo(app.devModel.Company,{foreignKey:'company_id'})
    // companyOperation.hasMany(app.devModel.User,{foreignKey: 'park_id'})
  
}
CompanyOperation.model = model
  return CompanyOperation
}