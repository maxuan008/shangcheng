module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    confCompanyClass_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      
      park_id:INTEGER(11),
      name: STRING(100), //企业类别
  
      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const ConfCompanyClass = app.devSeq.DevMysqlSeq.define('confCompanyClass', model, {
    paranoid: true
  })
  ConfCompanyClass.associate = function() {
    ConfCompanyClass.hasMany(app.devModel.Company,{foreignKey:'confCompanyClass_id'})
    ConfCompanyClass.belongsTo(app.devModel.Park,{foreignKey:'park_id'})
    ConfCompanyClass.hasMany(app.devModel.ParkCountCompanyClass,{foreignKey:'confCompanyClass_id'})
}
ConfCompanyClass.model = model
  return ConfCompanyClass
}