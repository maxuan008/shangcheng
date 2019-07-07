module.exports = app => {
  const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, BIGINT, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    serverShareholders_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },

    serverOrg_id: INTEGER(11),
    name: STRING(100),
    position: INTEGER(2), //含义：
    holdingRate: DECIMAL(10, 5),
    investmentAmount: STRING(100),
    type: INTEGER(2), //含义：股东类型
    isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const ServerShareholders = app.devSeq.DevMysqlSeq.define('serverShareholders', model, {
    paranoid: true
  })
  ServerShareholders.associate = function () {

    ServerShareholders.belongsTo(app.devModel.ServerOrg, { foreignKey: 'serverOrg_id' })
  }
  ServerShareholders.model = model
  return ServerShareholders
}