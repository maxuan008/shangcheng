module.exports = app => {
  const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    answerTalentPlan_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },

    answer_id: INTEGER(11),
    confTalentPlan_id: INTEGER(11),  //人才计划配置
    name: STRING(100), //人才计划名称
    number: INTEGER(11),
    isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const AnswerTalentPlan = app.model.define('answerTalentPlan', model, {
    paranoid: true
  })
  AnswerTalentPlan.associate = function () {
    AnswerTalentPlan.belongsTo(app.pgModel.Answer, { foreignKey: 'answer_id' })
    AnswerTalentPlan.belongsTo(app.pgModel.ConfTalentPlan, { foreignKey: 'confTalentPlan_id' })
    // Answer.belongsTo(app.pgModel.ConfTalentPlan,{foreignKey:'confTalentPlan_id'})
    // companyQualification.hasMany(app.pgModel.User,{foreignKey: 'park_id'})

  }
  AnswerTalentPlan.model = model
  return AnswerTalentPlan
}