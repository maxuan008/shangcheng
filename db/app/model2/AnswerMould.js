module.exports = app => {
  const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    answerMould_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },

    uidStr: STRING(100),
    quesMould_id: INTEGER(11),
    park_id: INTEGER(11),

    year: INTEGER(11), // 年份
    mouldName: STRING(150),  //名称
    companyName: { type: INTEGER(2), defaultValue: 0 }, // 填报单位

    // 经营信息 -------------------------------------

    yearlyIncoming: { type: INTEGER(2), defaultValue: 0 }, // 本年度总收入
    netProfit: { type: INTEGER(2), defaultValue: 0 }, // 净利润
    exportSum: { type: INTEGER(2), defaultValue: 0 }, // 出口总额
    yearlyRDFund: { type: INTEGER(2), defaultValue: 0 }, // 年度研究与试验发展经费
    taxPayed: { type: INTEGER(2), defaultValue: 0 }, // 实际上缴税费


    // 人才信息 -------------------------------------
    total: { type: INTEGER(2), defaultValue: 0 }, // 企业总人数
    rd: { type: INTEGER(2), defaultValue: 0 }, // 研发人员
    science: { type: INTEGER(2), defaultValue: 0 }, // 科技活动人员
    doctor: { type: INTEGER(2), defaultValue: 0 }, // 博士人数
    master: { type: INTEGER(2), defaultValue: 0 }, // 硕士人数
    postgraduate: { type: INTEGER(2), defaultValue: 0 }, // 研究生人数
    bachelor: { type: INTEGER(2), defaultValue: 0 }, // 本科生人数
    overseas: { type: INTEGER(2), defaultValue: 0 }, // 留学人数
    college: { type: INTEGER(2), defaultValue: 0 }, // 大专生人数
    secondary: { type: INTEGER(2), defaultValue: 0 }, // 中专生人数
    internship: { type: INTEGER(2), defaultValue: 0 }, // 接纳大学生、研究生实习人员
    freshGraduate: { type: INTEGER(2), defaultValue: 0 }, // 接纳应届毕业生就业人员

    // 知识产权 -------------------------------------
    proprietary: { type: INTEGER(2), defaultValue: 0 }, //自主知识产权
    invention: { type: INTEGER(2), defaultValue: 0 }, //发明专利
    utility: { type: INTEGER(2), defaultValue: 0 },  //实用专利
    appearance: { type: INTEGER(2), defaultValue: 0 }, //外观专利
    PCT: { type: INTEGER(2), defaultValue: 0 },
    trademark: { type: INTEGER(2), defaultValue: 0 }, //商标
    copyright: { type: INTEGER(2), defaultValue: 0 },  //著作权
    ic: { type: INTEGER(2), defaultValue: 0 },    //集成电路
    software: { type: INTEGER(2), defaultValue: 0 }, //软件产品



    // 国家政策支持 -------------------------------------
    nationalRDProject: { type: INTEGER(2), defaultValue: 0 }, // 承担国家科研和产业化项目（项）
    nationalRDFinancing: { type: INTEGER(2), defaultValue: 0 }, // 承担国家科研和产业化获得资助（元）
    ProvinceRDProject: { type: INTEGER(2), defaultValue: 0 }, // 承担省市区科研开发项目（项）
    ProvinceRDFinancing: { type: INTEGER(2), defaultValue: 0 }, // 承担省市区科研开发项目获得资助金额（元）


    flag: { type: INTEGER(2), defaultValue: 1 }, //状态1：生效中, 0停止收集

    password: STRING(100), //密码

    remark: TEXT, // 备注

    isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const AnswerMould = app.devSeq.DevMysqlSeq.define('answerMould', model, {
    paranoid: true
  })
  AnswerMould.associate = function () {
    AnswerMould.belongsTo(app.devModel.QuesMould, { foreignKey: 'quesMould_id' })
    AnswerMould.belongsTo(app.devModel.Park, { foreignKey: 'park_id' })
    AnswerMould.hasMany(app.devModel.AnswerMouldQualification, { foreignKey: 'answerMould_id' })
    AnswerMould.hasMany(app.devModel.AnswerMouldTalentPlan, { foreignKey: 'answerMould_id' })
    AnswerMould.belongsToMany(app.devModel.ConfQualification, { through: 'answerMouldQualification', foreignKey: 'answerMould_id' })
    AnswerMould.belongsToMany(app.devModel.ConfTalentPlan, { through: 'answerMouldTalentPlan', foreignKey: 'answerMould_id' })
    AnswerMould.hasMany(app.devModel.Answer, { foreignKey: 'answerMould_id' })
    // AnswerMould.belongsTo(app.devModel.ConfTalentPlan,{foreignKey:'confTalentPlan_id'})
    // companyQualification.hasMany(app.devModel.User,{foreignKey: 'park_id'})

  }
  AnswerMould.model = model
  return AnswerMould
}