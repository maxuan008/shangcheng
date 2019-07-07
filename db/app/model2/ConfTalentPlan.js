module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    confTalentPlan_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      
      park_id:INTEGER(11),
      name: STRING(100), // 人才计划

      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const ConfTalentPlan = app.devSeq.DevMysqlSeq.define('confTalentPlan', model, {
    paranoid: true
  })
  ConfTalentPlan.associate = function() {
   
    ConfTalentPlan.belongsTo(app.devModel.Park,{foreignKey:'park_id'})
    ConfTalentPlan.belongsToMany(app.devModel.Talent,{through:'talentConfPlan',foreignKey:'confTalentPlan_id'})
    ConfTalentPlan.belongsToMany(app.devModel.CompanyTalentStat,{through:'companyTalentStatAndPlan',foreignKey:'confTalentPlan_id'})
    ConfTalentPlan.hasMany(app.devModel.CompanyTalentStatAndPlan,{foreignKey:'confTalentPlan_id'})
    ConfTalentPlan.belongsToMany(app.devModel.QuesMould,{through:'quesMouldConfTalentPlan', foreignKey:'confTalentPlan_id'})
    ConfTalentPlan.belongsToMany(app.devModel.AnswerMould,{through:'answerMouldTalentPlan', foreignKey:'confTalentPlan_id'})
}
ConfTalentPlan.model = model
  return ConfTalentPlan
}