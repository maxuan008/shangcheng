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
      isSystemBuild:{type:INTEGER(2) , defaultValue: 0  }, //是否系统生成
      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const ConfSetParkAddress = app.model.define('confSetParkAddress', model, {
    paranoid: true
  })
  ConfSetParkAddress.associate = function() {
   
    ConfSetParkAddress.belongsTo(app.pgModel.Park,{foreignKey:'park_id'})
}
ConfSetParkAddress.model = model
  return ConfSetParkAddress
}