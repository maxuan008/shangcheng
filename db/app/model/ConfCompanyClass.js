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
        confCompanyClass_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        park_id: INTEGER(11),
        name: STRING(100), //企业类别
        isSystemBuild: { type: INTEGER(2), defaultValue: 0 }, //是否系统生成
        isTeam: { type: INTEGER(2), defaultValue: 2 }, // 是否是团队 1是 2 否
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const ConfCompanyClass = app.model.define('confCompanyClass', model, {
        paranoid: true
    })
    ConfCompanyClass.associate = function() {
        ConfCompanyClass.hasMany(app.pgModel.Company, { foreignKey: 'confCompanyClass_id' })
        ConfCompanyClass.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
        ConfCompanyClass.hasMany(app.pgModel.ParkCountCompanyClass, {
            foreignKey: 'confCompanyClass_id'
        })
    }
    ConfCompanyClass.model = model
    return ConfCompanyClass
}
