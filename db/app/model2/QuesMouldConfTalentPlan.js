module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    quesMouldConfTalentPlan_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },

    quesMould_id: INTEGER(11),
    confTalentPlan_id:   INTEGER(11),  //人才计划配置

    isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const QuesMouldConfTalentPlan = app.devSeq.DevMysqlSeq.define('quesMouldConfTalentPlan', model, {
    paranoid: true
  })
  QuesMouldConfTalentPlan.associate = function() {
    QuesMouldConfTalentPlan.belongsTo(app.devModel.QuesMould,{foreignKey:'quesMould_id'})
    QuesMouldConfTalentPlan.belongsTo(app.devModel.ConfTalentPlan,{foreignKey:'confTalentPlan_id'})
    // companyQualification.hasMany(app.devModel.User,{foreignKey: 'park_id'})
  
}
QuesMouldConfTalentPlan.model = model
  return QuesMouldConfTalentPlan
}