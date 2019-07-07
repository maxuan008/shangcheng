module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize
  
  const model = {

    roleP_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
       
      P_id:{
          type:INTEGER(11),
          references: {
            model: 'Permission', // Can be both a string representing the table name, or a reference to the model
            key:   "P_id"
          }
      },
      role_id: {
          type:INTEGER(11),
          references: {
            model: 'role', // Can be both a string representing the table name, or a reference to the model
            key:   "role_id"
          }
        },
      available: {type:BOOLEAN , defaultValue: false },
     
      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const RolePermission = app.model.define('rolePermission', model, {
    paranoid: true
  })
  RolePermission.model = model
  RolePermission.associate = function() {
    RolePermission.belongsTo(app.pgModel.Permission,{foreignKey:'P_id'})
  }
  return RolePermission
}