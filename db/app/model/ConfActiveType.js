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
        STRING,
        BIGINT,
        FLOAT
    } = app.Sequelize

    const model = {
        confActiveType_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        park_id: INTEGER(11),
        name: STRING(50), //活动类别
        isSystemBuild: { type: INTEGER(2), defaultValue: 0 }, //是否系统生成

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const ConfActiveType = app.model.define('confActiveType', model, {
        paranoid: true
    })
    ConfActiveType.associate = function() {
        ConfActiveType.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
        ConfActiveType.hasMany(app.pgModel.ServiceActivity,{foreignKey:'confActiveType_id'})
    }
    ConfActiveType.model = model
    return ConfActiveType
}
