module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

      confNeed_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true
      },

      park_id:INTEGER(11),
      name: STRING(100), // 类别名
      isSystemBuild:{type:INTEGER(2) , defaultValue: 0  }, //是否系统生成

      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const ConfNeed = app.model.define('confNeed', model, {
    paranoid: true
  })
  ConfNeed.associate = function() {
   
    ConfNeed.belongsTo(app.pgModel.Park,{foreignKey:'park_id'})
    ConfNeed.hasMany(app.pgModel.CompanyNeed,{foreignKey:'companyNeed_id'})
    //ConfNeed.belongsToMany(app.pgModel.Company,{through:'companyConfTag',foreignKey:'confNeed_id'})
}
ConfNeed.model = model
  return ConfNeed
}