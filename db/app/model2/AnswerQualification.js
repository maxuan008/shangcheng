module.exports = app => {
  const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    answerQualification_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },

    answer_id: INTEGER(11),
    confQualification_id: INTEGER(11),  //企业资质配置
    name: STRING(100), //资质名称
    value: INTEGER(2),
    isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const AnswerQualification = app.devSeq.DevMysqlSeq.define('answerQualification', model, {
    paranoid: true
  })
  AnswerQualification.associate = function () {
    AnswerQualification.belongsTo(app.devModel.Answer, { foreignKey: 'answer_id' })
    AnswerQualification.belongsTo(app.devModel.ConfQualification, { foreignKey: 'confQualification_id' })
    // Answer.belongsTo(app.devModel.ConfTalentPlan,{foreignKey:'confTalentPlan_id'})
    // companyQualification.hasMany(app.devModel.User,{foreignKey: 'park_id'})

  }
  AnswerQualification.model = model
  return AnswerQualification
}