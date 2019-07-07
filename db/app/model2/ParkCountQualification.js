module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    parkCountQualification_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },
    
      parkCount_id:INTEGER(11),
      confQualification_id: INTEGER(11),
      name: STRING(100),   //企业资质名
      number:INTEGER(11),  //统计数量

      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const ParkCountQualification = app.devSeq.DevMysqlSeq.define('parkCountQualification', model, {
    paranoid: true
  })
  ParkCountQualification.associate = function() {
    ParkCountQualification.belongsTo(app.devModel.ParkCount,{foreignKey:'parkCount_id'})
    ParkCountQualification.belongsTo(app.devModel.ConfQualification,{foreignKey:'confQualification_id'})
    // Park.belongsToMany(app.devModel.Area,{through: 'areaPark',foreignKey: 'park_id'})
    // Park.hasMany(app.devModel.User,{foreignKey: 'park_id'})
    // Park.hasMany(app.devModel.ConfTag,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfSetParkAddress,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfParkAddress,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfTalentPlan,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfIndustryConcern,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfQualification,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfStateOccupancy,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfCompanyInfoType,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfServerClass,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfServerType,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfJoinWork,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfCompanyClass,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.Talent,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ParkCount,{foreignKey:'park_id'})
}
ParkCountQualification.model = model
  return ParkCountQualification
}