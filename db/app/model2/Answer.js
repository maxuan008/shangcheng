module.exports = app => {
  const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING, BIGINT } = app.Sequelize

  const model = {

    answer_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },

    answerMould_id: INTEGER(11),

    year: INTEGER, // 年份
    companyName: STRING(100),  // 填报单位

    company_id: INTEGER(11),

    // 经营信息 -------------------------------------

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


    // 人才信息 -------------------------------------
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

    // 知识产权 -------------------------------------
    proprietary: INTEGER(11), //自主知识产权
    invention: INTEGER(11), //发明专利
    utility: INTEGER(11),  //实用专利
    appearance: INTEGER(11), //外观专利
    PCT: INTEGER(11),
    trademark: INTEGER(11), //商标
    copyright: INTEGER(11),  //著作权
    ic: INTEGER(11),    //集成电路
    software: INTEGER(11), //软件产品


    flag: { type: INTEGER(2), defaultValue: 0 }, //状态：1审核通过, 0待审核， -1：未通过

    source: { type: INTEGER(2), defaultValue: 1 }, //来源：1web端, 2app端， 3：小程序端

    remark: TEXT, // 备注

    isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const Answer = app.devSeq.DevMysqlSeq.define('answer', model, {
    paranoid: true
  })
  Answer.associate = function () {
    Answer.belongsTo(app.devModel.AnswerMould, { foreignKey: 'answerMould_id' })
    Answer.hasMany(app.devModel.AnswerQualification, { foreignKey: 'answer_id' })
    Answer.hasMany(app.devModel.AnswerTalentPlan, { foreignKey: 'answer_id' })
    // Answer.belongsTo(app.devModel.ConfTalentPlan,{foreignKey:'confTalentPlan_id'})
    // companyQualification.hasMany(app.devModel.User,{foreignKey: 'park_id'})

  }
  Answer.model = model
  return Answer
}