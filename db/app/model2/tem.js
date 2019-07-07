module.exports=app=>{
    const Sequelize = require('sequelize')
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    park_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },

      name: STRING(50), // 名称
      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效

      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }


  //console.log("app.model:",app.devSeq.DevMysqlSeq );

  const Park = app.devSeq.DevMysqlSeq.define('park', model, {
    paranoid: true
  })
//   Park.associate = function() {
//     Park.belongsToMany(app.devModel.Area,{through: 'areaPark',foreignKey: 'park_id'})
//     Park.hasMany(app.devModel.Company,{foreignKey:'park_id'})
//     Park.hasMany(app.devModel.User,{foreignKey: 'park_id'})
//     Park.hasMany(app.devModel.ConfTag,{foreignKey:'park_id'})
//     Park.hasMany(app.devModel.ConfSetParkAddress,{foreignKey:'park_id'})
//     Park.hasMany(app.devModel.ConfParkAddress,{foreignKey:'park_id'})
//     Park.hasMany(app.devModel.ConfTalentPlan,{foreignKey:'park_id'})
//     Park.hasMany(app.devModel.ConfIndustryConcern,{foreignKey:'park_id'})
//     Park.hasMany(app.devModel.ConfQualification,{foreignKey:'park_id'})
//     Park.hasMany(app.devModel.ConfStateOccupancy,{foreignKey:'park_id'})
//     Park.hasMany(app.devModel.ConfCompanyInfoType,{foreignKey:'park_id'})
//     Park.hasMany(app.devModel.ConfServerClass,{foreignKey:'park_id'})
//     Park.hasMany(app.devModel.ConfServerType,{foreignKey:'park_id'})
//     Park.hasMany(app.devModel.ConfJoinWork,{foreignKey:'park_id'})
//     Park.hasMany(app.devModel.ConfCompanyClass,{foreignKey:'park_id'})
//     Park.hasMany(app.devModel.Talent,{foreignKey:'park_id'})
//     Park.hasMany(app.devModel.ParkCount,{foreignKey:'park_id'})
// }
Park.model = model
  return Park
}