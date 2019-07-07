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

      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const ConfTag = app.devSeq.DevMysqlSeq.define('confTag', model, {
    paranoid: true
  })
  ConfTag.associate = function() {
   
    ConfTag.belongsTo(app.devModel.Park,{foreignKey:'park_id'})
    ConfTag.belongsToMany(app.devModel.Company,{through:'companyConfTag',foreignKey:'confTag_id'})
}
ConfTag.model = model
  return ConfTag
}