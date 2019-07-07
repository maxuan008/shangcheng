module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    areaPark_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },

      area_id:INTEGER(11),
      park_id:INTEGER(11),

      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const AreaPark = app.model.define('areaPark', model, {
    paranoid: true
  })
  AreaPark.model = model
  return AreaPark
}