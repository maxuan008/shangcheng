module.exports = app => {
  const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    answerMouldTalentPlan_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },

    answerMould_id: INTEGER(11),
    confTalentPlan_id: INTEGER(11),  //人才计划配置
    name: STRING(100), //人才计划名称

    isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const AnswerMouldTalentPlan = app.model.define('answerMouldTalentPlan', model, {
    paranoid: true
  })
  AnswerMouldTalentPlan.associate = function () {
    AnswerMouldTalentPlan.belongsTo(app.pgModel.AnswerMould, { foreignKey: 'answerMould_id' })
    AnswerMouldTalentPlan.belongsTo(app.pgModel.ConfTalentPlan, { foreignKey: 'confTalentPlan_id' })
    // companyQualification.hasMany(app.pgModel.User,{foreignKey: 'park_id'})

  }
  AnswerMouldTalentPlan.model = model
  return AnswerMouldTalentPlan
}