module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    confJoinWork_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      
      park_id:INTEGER(11),
      name: STRING(100), //合作方式
  
      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const ConfJoinWork = app.devSeq.DevMysqlSeq.define('confJoinWork', model, {
    paranoid: true
  })
  ConfJoinWork.associate = function() {
   
    ConfJoinWork.belongsTo(app.devModel.Park,{foreignKey:'park_id'})
    ConfJoinWork.belongsToMany(app.devModel.ServerOrg,{through:'joinWorkServerOrg',foreignKey:'confJoinWork_id'})
}
ConfJoinWork.model = model
  return ConfJoinWork
}