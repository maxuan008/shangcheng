module.exports = app => {
  const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

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
    applicant: STRING(800), // 申请人
    checkStatus: STRING(100), //专利是否有效，审查状态   

    //高新工具新增字段
    acquisitionMode:STRING(100), //获得方式：1自主研发  2转让  3独占许可
    scoreType:STRING(500), //高新评分类别
    isFirstGX: { type: INTEGER(3), defaultValue: 0 }, //是否为首次高新评定 0：空  1是  2否
    accessory:TEXT,//附件
    isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const CompanyPatent = app.model.define('companyPatent', model, {
    paranoid: true
  })
  CompanyPatent.associate = function () {
    CompanyPatent.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
    // companyPatent.hasMany(app.pgModel.User,{foreignKey: 'park_id'})

  }
  CompanyPatent.model = model
  return CompanyPatent
}