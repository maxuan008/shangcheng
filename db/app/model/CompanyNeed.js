module.exports = app => {
  const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    companyNeed_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },

    company_id: INTEGER(11),
    collectDate: DATEONLY, //需求时间,系统采集时间
    type:INTEGER(3) ,  // 需求类别， 人才需求， 技术需求 资金需求  市场需求
    status: INTEGER(3) , //是否已解决，0否，1已解决
    creater:{ type: INTEGER(3), defaultValue: -1 }, //入录人, -1系统输入,其它为user_id
    details: TEXT, //需求描述
    contact: STRING(100), //企业联系人
    contactNumber: STRING(20), //联系电话
    
    solutDate: DATEONLY, //解决日期
    solutionPerson: STRING(50), //解决人
    solution: STRING(1000), //解决方案

    confNeed_id:INTEGER(11) , 

    //================
  
    isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const CompanyNeed = app.model.define('companyNeed', model, {
    paranoid: true
  })
  CompanyNeed.associate = function () {
    CompanyNeed.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
    // companyFinancing.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
    CompanyNeed.belongsTo(app.pgModel.User,{foreignKey:'creater',targetKey:'user_id'})
    CompanyNeed.belongsTo(app.pgModel.ConfNeed,{ foreignKey: 'confNeed_id' })
    CompanyNeed.hasMany(app.pgModel.NeedSource,{foreignKey:'companyNeed_id'})
    CompanyNeed.hasMany(app.pgModel.TalentRecruit,{foreignKey:'companyNeed_id'})
  }
  CompanyNeed.model = model
  return CompanyNeed
}