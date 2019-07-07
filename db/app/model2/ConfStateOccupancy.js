module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    confStateOccupancy_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      
      park_id:INTEGER(11),
      name: STRING(100), //入住状态

      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const ConfStateOccupancy = app.devSeq.DevMysqlSeq.define('confStateOccupancy', model, {
    paranoid: true
  })
  ConfStateOccupancy.associate = function() {
    ConfStateOccupancy.hasMany(app.devModel.Company,{foreignKey:'confStateOccupancy_id'})
    ConfStateOccupancy.belongsTo(app.devModel.Park,{foreignKey:'park_id'})
}
ConfStateOccupancy.model = model
  return ConfStateOccupancy
}