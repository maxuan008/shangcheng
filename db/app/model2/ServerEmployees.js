module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    serverEmployees_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
  
        serverOrg_id:INTEGER(11),
        name:STRING(100),
        position :INTEGER(2), //含义：职位
    
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const ServerEmployees = app.devSeq.DevMysqlSeq.define('serverEmployees', model, {
    paranoid: true
  })
  ServerEmployees.associate = function() {
   
    ServerEmployees.belongsTo(app.devModel.ServerOrg,{foreignKey:'serverOrg_id'})
}
ServerEmployees.model = model
  return ServerEmployees
}