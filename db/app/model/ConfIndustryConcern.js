module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    confIndustryConcern_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      
      park_id:INTEGER(11),
      name: STRING(100), //行业关注
      isSystemBuild:{type:INTEGER(2) , defaultValue: 0  }, //是否系统生成
      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const ConfIndustryConcern = app.model.define('confIndustryConcern', model, {
    paranoid: true
  })
  ConfIndustryConcern.associate = function() {
   
    ConfIndustryConcern.belongsTo(app.pgModel.Park,{foreignKey:'park_id'})
}
ConfIndustryConcern.model = model
  return ConfIndustryConcern
}