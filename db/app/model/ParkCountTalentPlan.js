module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    parkCountTalentPlan_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },
    
      parkCount_id:INTEGER(11),
      confTalentPlan_id: INTEGER(11),
      name: STRING(100),   //人才计划名
      number:INTEGER(11),  //统计数量

      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const ParkCountTalentPlan = app.model.define('parkCountTalentPlan', model, {
    paranoid: true
  })
  ParkCountTalentPlan.associate = function() {
    ParkCountTalentPlan.belongsTo(app.pgModel.ParkCount,{foreignKey:'parkCount_id'})
    ParkCountTalentPlan.belongsTo(app.pgModel.ConfTalentPlan,{foreignKey:'confTalentPlan_id'})
    // Park.belongsToMany(app.pgModel.Area,{through: 'areaPark',foreignKey: 'park_id'})
    // Park.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
    // Park.hasMany(app.pgModel.ConfTag,{foreignKey:'park_id'})
    // Park.hasMany(app.pgModel.ConfSetParkAddress,{foreignKey:'park_id'})
    // Park.hasMany(app.pgModel.ConfParkAddress,{foreignKey:'park_id'})
    // Park.hasMany(app.pgModel.ConfTalentPlan,{foreignKey:'park_id'})
    // Park.hasMany(app.pgModel.ConfIndustryConcern,{foreignKey:'park_id'})
    // Park.hasMany(app.pgModel.ConfQualification,{foreignKey:'park_id'})
    // Park.hasMany(app.pgModel.ConfStateOccupancy,{foreignKey:'park_id'})
    // Park.hasMany(app.pgModel.ConfCompanyInfoType,{foreignKey:'park_id'})
    // Park.hasMany(app.pgModel.ConfServerClass,{foreignKey:'park_id'})
    // Park.hasMany(app.pgModel.ConfServerType,{foreignKey:'park_id'})
    // Park.hasMany(app.pgModel.ConfJoinWork,{foreignKey:'park_id'})
    // Park.hasMany(app.pgModel.ConfCompanyClass,{foreignKey:'park_id'})
    // Park.hasMany(app.pgModel.Talent,{foreignKey:'park_id'})
    // Park.hasMany(app.pgModel.ParkCount,{foreignKey:'park_id'})
}
ParkCountTalentPlan.model = model
  return ParkCountTalentPlan
}