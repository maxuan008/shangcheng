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
        confQualification_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        park_id: INTEGER(11),
        name: STRING(100), //企业资质
        isSystemBuild: { type: INTEGER(2), defaultValue: 0 }, //是否系统生成
        isTeam: { type: INTEGER(2), defaultValue: 2 }, // 是否是团队 1是 2 否
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const ConfQualification = app.model.define('confQualification', model, {
        paranoid: true
    })
    ConfQualification.associate = function() {
        ConfQualification.belongsToMany(app.pgModel.Company, {
            through: 'companyQualification',
            foreignKey: 'confQualification_id'
        })
        ConfQualification.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
        ConfQualification.belongsToMany(app.pgModel.QuesMould, {
            through: 'quesMouldConfQualification',
            foreignKey: 'confQualification_id'
        })
        ConfQualification.belongsToMany(app.pgModel.AnswerMould, {
            through: 'answerMouldQualification',
            foreignKey: 'confQualification_id'
        })
    }
    ConfQualification.model = model
    return ConfQualification
}
