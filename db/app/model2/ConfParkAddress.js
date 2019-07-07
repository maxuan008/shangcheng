module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    confParkAddress_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      
      park_id:INTEGER(11),
      name: STRING(100), // 园区地址

      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const ConfParkAddress = app.devSeq.DevMysqlSeq.define('confParkAddress', model, {
    paranoid: true
  })
  ConfParkAddress.associate = function() {
   
    ConfParkAddress.belongsTo(app.devModel.Park,{foreignKey:'park_id'})
}
ConfParkAddress.model = model
  return ConfParkAddress
}