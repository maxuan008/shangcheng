module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    confCompanyInfoType_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      
      park_id:INTEGER(11),
      name: STRING(100), //企业资料类别

      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const ConfCompanyInfoType = app.devSeq.DevMysqlSeq.define('confCompanyInfoType', model, {
    paranoid: true
  })
  ConfCompanyInfoType.associate = function() {
    // ConfCompanyInfoType.hasMany(app.devModel.Company,{foreignKey:'confCompanyInfoType_id'})
    ConfCompanyInfoType.belongsTo(app.devModel.Park,{foreignKey:'park_id'})
    ConfCompanyInfoType.belongsToMany(app.devModel.Company,{through:'companyFiles',foreignKey:'confCompanyInfoType_id'})
}
ConfCompanyInfoType.model = model
  return ConfCompanyInfoType
}