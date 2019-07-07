module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    companyTalentStatAndPlan_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        },
        
        companyTalentStat_id:INTEGER(11),
        confTalentPlan_id:INTEGER(11),
        
        number:INTEGER(11),// 人才统计的数量
        
        isValid: {type:INTEGER(2) , defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const CompanyTalentStatAndPlan = app.model.define('companyTalentStatAndPlan', model, {
    paranoid: true
  })
  CompanyTalentStatAndPlan.associate = function() {
    CompanyTalentStatAndPlan.belongsTo(app.pgModel.CompanyTalentStat,{foreignKey:'companyTalentStat_id'})
    CompanyTalentStatAndPlan.belongsTo(app.pgModel.ConfTalentPlan,{foreignKey:'confTalentPlan_id'})
    // companyTalentStatAndPlan.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
  
}
CompanyTalentStatAndPlan.model = model
  return CompanyTalentStatAndPlan
}