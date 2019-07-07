module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    joinWorkServerOrg_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
  
        serverOrg_id:INTEGER(11),
        confJoinWork_id:INTEGER(11),
  
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const JoinWorkServerOrg = app.devSeq.DevMysqlSeq.define('joinWorkServerOrg', model, {
    paranoid: true
  })
  JoinWorkServerOrg.associate = function() {
   
    // JoinWorkServerOrg.belongsTo(app.devModel.Park,{foreignKey:'park_id'})
    JoinWorkServerOrg.belongsTo(app.devModel.ServerOrg,{foreignKey:'serverOrg_id'})
    JoinWorkServerOrg.belongsTo(app.devModel.ConfJoinWork,{foreignKey:'confJoinWork_id'})
}
JoinWorkServerOrg.model = model
  return JoinWorkServerOrg
}