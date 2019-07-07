module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    P_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
    
      root_id:{type:INTEGER(11) , defaultValue: -1  } , //-1为根结点
      father_id:{type:INTEGER(11) , defaultValue: -1  }, // -根结点时为-1
      
    
      name: STRING(30), // 名字
      api:STRING(120),
      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const Permission = app.model.define('Permission', model, {
    paranoid: true
  })
  Permission.associate = function() {
        Permission.hasMany(app.pgModel.OperationPermission,{foreignKey: 'P_id',as:'operation'})
        Permission.hasMany(app.pgModel.RolePermission,{foreignKey:'P_id'})
    }
  Permission.model = model
  return Permission
}