module.exports = app => {
  const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    areaPark_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },

    area_id: INTEGER(11),
    park_id: INTEGER(11),

    isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const AreaPark = app.devSeq.DevMysqlSeq.define('areaPark', model, {
    paranoid: true
  })
  AreaPark.associate = function () {
    AreaPark.belongsTo(app.devModel.Area, { foreignKey: 'area_id' })
    AreaPark.belongsTo(app.devModel.Park, { foreignKey: 'park_id' })

    // AreaPark.belongsToMany(app.devModel.)
    // Area.hasMany(app.devModel.OperationPermission)
  }
  AreaPark.model = model
  return AreaPark
}