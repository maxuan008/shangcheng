module.exports = app => {
  const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    confTalentPlan_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },

    park_id: INTEGER(11),
    name: STRING(100), // 人才计划
    isSystemBuild:{type:INTEGER(2) , defaultValue: 0  }, //是否系统生成
    isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const ConfTalentPlan = app.model.define('confTalentPlan', model, {
    paranoid: true
  })
  ConfTalentPlan.associate = function () {

    ConfTalentPlan.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
    ConfTalentPlan.belongsToMany(app.pgModel.Talent, { through: 'talentConfPlan', foreignKey: 'confTalentPlan_id' })
    ConfTalentPlan.belongsToMany(app.pgModel.CompanyTalentStat, { through: 'companyTalentStatAndPlan', foreignKey: 'confTalentPlan_id' })
    ConfTalentPlan.hasMany(app.pgModel.CompanyTalentStatAndPlan, { foreignKey: 'confTalentPlan_id' })
    ConfTalentPlan.belongsToMany(app.pgModel.QuesMould, { through: 'quesMouldConfTalentPlan', foreignKey: 'confTalentPlan_id' })
    ConfTalentPlan.belongsToMany(app.pgModel.AnswerMould, { through: 'answerMouldTalentPlan', foreignKey: 'confTalentPlan_id' })
  }
  ConfTalentPlan.model = model
  return ConfTalentPlan
}