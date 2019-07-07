module.exports = app => {
  const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    confServerType_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },

    park_id: INTEGER(11),
    name: STRING(100), //服务类型
    isSystemBuild:{type:INTEGER(2) , defaultValue: 0  }, //是否系统生成
    isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const ConfServerType = app.model.define('confServerType', model, {
    paranoid: true
  })
  ConfServerType.associate = function () {

    ConfServerType.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
    ConfServerType.hasMany(app.pgModel.ServerOrg, { foreignKey: 'confServerType_id' })
  }
  ConfServerType.model = model
  return ConfServerType
}