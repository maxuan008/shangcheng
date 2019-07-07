module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    role_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },

      name: STRING(30), // 名字
     
      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE,
      park_id:INTEGER(11)

  }

  const Role = app.devSeq.DevMysqlSeq.define('role', model, {
    paranoid: true
  })
  Role.associate = function() {
    Role.hasMany(app.devModel.User,{foreignKey: 'park_id'})
  
}
  Role.model = model
  return Role
}