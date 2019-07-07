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
        confMentors_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },

        park_id: INTEGER(11),
        name: STRING(50), //导师类别
        isSystemBuild: { type: INTEGER(2), defaultValue: 0 }, //是否系统生成

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const ConfMentors = app.model.define('confMentors', model, {
        paranoid: true
    })
    ConfMentors.associate = function () {
        ConfMentors.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
        ConfMentors.hasMany(app.pgModel.Talent, { foreignKey: 'confMentors_id' })
    }
    ConfMentors.model = model
    return ConfMentors
}
