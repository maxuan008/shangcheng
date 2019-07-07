module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    operationP_id: {
        type: INTEGER(11), 
        primaryKey: true,
        autoIncrement: true,
      },
      
      P_id:{
          type: INTEGER(11),
          references: {
            model: 'Permission', // Can be both a string representing the table name, or a reference to the model
            key:   "P_id"
          }
      },
    //   role_id: INTEGER(11), 
      name: STRING(30), // 名字
      api: STRING(120),
      isValid: {type:INTEGER(2) , defaultValue: 1 }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const OperationPermission = app.devSeq.DevMysqlSeq.define('operationPermission', model, {
    paranoid: true
  })
  OperationPermission.model = model
  OperationPermission.associate = function() {
    OperationPermission.belongsTo(app.devModel.Permission,{foreignKey: 'P_id'})
    OperationPermission.hasMany(app.devModel.RoleOperationPermission,{foreignKey: 'operationP_id'})
}
  return OperationPermission
}