module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    confTag_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      
      park_id:INTEGER(11),
      name: STRING(50), // 图谱标签
      isSystemBuild:{type:INTEGER(2) , defaultValue: 0  }, //是否系统生成
      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const ConfTag = app.model.define('confTag', model, {
    paranoid: true
  })
  ConfTag.associate = function() {
   
    ConfTag.belongsTo(app.pgModel.Park,{foreignKey:'park_id'})
    ConfTag.belongsToMany(app.pgModel.Company,{through:'companyConfTag',foreignKey:'confTag_id'})
}
ConfTag.model = model
  return ConfTag
}