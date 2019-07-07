module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    confServerClass_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      
      park_id:INTEGER(11),
      name: STRING(100), //服务类别

      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const ConfServerClass = app.devSeq.DevMysqlSeq.define('confServerClass', model, {
    paranoid: true
  })
  ConfServerClass.associate = function() {
   
    ConfServerClass.belongsTo(app.devModel.Park,{foreignKey:'park_id'})
    ConfServerClass.hasMany(app.devModel.ServerOrg,{foreignKey:'confServerClass_id'})
}
ConfServerClass.model = model
  return ConfServerClass
}