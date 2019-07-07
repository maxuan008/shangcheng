module.exports = app => {
  const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    answerMouldQualification_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },

    answerMould_id: INTEGER(11),
    confQualification_id: INTEGER(11),  //企业资质配置
    name: STRING(100), //资质名称

    isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const AnswerMouldQualification = app.model.define('answerMouldQualification', model, {
    paranoid: true
  })
  AnswerMouldQualification.associate = function () {
    AnswerMouldQualification.belongsTo(app.pgModel.AnswerMould, { foreignKey: 'answerMould_id' })
    AnswerMouldQualification.belongsTo(app.pgModel.ConfQualification, { foreignKey: 'confQualification_id' })
    // answerMouldQualification.belongsTo(app.pgModel.ConfTalentPlan,{foreignKey:'confTalentPlan_id'})
    // companyQualification.hasMany(app.pgModel.User,{foreignKey: 'park_id'})

  }
  AnswerMouldQualification.model = model
  return AnswerMouldQualification
}