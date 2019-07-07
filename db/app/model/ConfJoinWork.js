module.exports = app => {
  const {
    TINYINT,
    JSON,
    BOOLEAN,
    TEXT,
    INTEGER,
    DATE,
    DATEONLY,
    ARRAY,
    DECIMAL,
    STRING
  } = app.Sequelize

  const model = {
    confJoinWork_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },

    park_id: INTEGER(11),
    name: STRING(100), //合作方式
    isSystemBuild:{type:INTEGER(2) , defaultValue: 0  }, //是否系统生成
    isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE
  }

  const ConfJoinWork = app.model.define('confJoinWork', model, {
    paranoid: true
  })
  ConfJoinWork.associate = function() {
    ConfJoinWork.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
    ConfJoinWork.belongsToMany(app.pgModel.ServerOrg, {
      through: 'joinWorkServerOrg',
      foreignKey: 'confJoinWork_id'
    })
  }
  ConfJoinWork.model = model
  return ConfJoinWork
}
