module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    talentConfPlan_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
  
        confTalentPlan_id:INTEGER(11),
        talent_id:INTEGER(11),
        joinedAt: STRING(30), // 入选时间
        joinedPrjName:STRING(300),
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const TalentConfPlan = app.devSeq.DevMysqlSeq.define('talentConfPlan', model, {
    paranoid: true
  })
  TalentConfPlan.associate = function() {
    TalentConfPlan.belongsTo(app.devModel.ConfTalentPlan,{foreignKey:'confTalentPlan_id'})
    TalentConfPlan.belongsTo(app.devModel.Talent,{foreignKey:'talent_id'})
    // companyFinancing.hasMany(app.devModel.User,{foreignKey: 'park_id'})
  
}
TalentConfPlan.model = model
  return TalentConfPlan
}