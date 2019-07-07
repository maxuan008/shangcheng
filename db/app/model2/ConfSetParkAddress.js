module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    confSetParkAddress_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      
      park_id:INTEGER(11),
      name: STRING(100), // 园区地址设定

      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const ConfSetParkAddress = app.devSeq.DevMysqlSeq.define('confSetParkAddress', model, {
    paranoid: true
  })
  ConfSetParkAddress.associate = function() {
   
    ConfSetParkAddress.belongsTo(app.devModel.Park,{foreignKey:'park_id'})
}
ConfSetParkAddress.model = model
  return ConfSetParkAddress
}