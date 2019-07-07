module.exports = app => {
  const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, BIGINT, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    serverQualification_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },

    serverOrg_id: INTEGER(11),
    name: STRING(100), //服务资质名称
    url: STRING(200),      //文件地址

    isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const ServerQualification = app.model.define('serverQualification', model, {
    paranoid: true
  })
  ServerQualification.associate = function () {

    ServerQualification.belongsTo(app.pgModel.ServerOrg, { foreignKey: 'serverOrg_id' })
  }
  ServerQualification.model = model
  return ServerQualification
}