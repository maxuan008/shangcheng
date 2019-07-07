module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    serverAgreement_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
  
        serverOrg_id:INTEGER(11),
        name: STRING(100), //资料名称
        url: STRING(200),      //文件地址
    
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const ServerAgreement = app.devSeq.DevMysqlSeq.define('serverAgreement', model, {
    paranoid: true
  })
  ServerAgreement.associate = function() {
   
    ServerAgreement.belongsTo(app.devModel.ServerOrg,{foreignKey:'serverOrg_id'})
}
ServerAgreement.model = model
  return ServerAgreement
}