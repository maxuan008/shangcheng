module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    roleOperationP_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
  
    operationP_id:INTEGER(11),
    role_id: INTEGER(11),
    P_id:INTEGER(11),
    available: {type:BOOLEAN , defaultValue: false },
    isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const RoleOperationPermission = app.devSeq.DevMysqlSeq.define('roleOperationPermission', model, {
    paranoid: true
  })
  RoleOperationPermission.associate = function() {
   
    RoleOperationPermission.belongsTo(app.devModel.OperationPermission,{foreignKey:'operationP_id'})
  }
  RoleOperationPermission.model = model
  return RoleOperationPermission
}