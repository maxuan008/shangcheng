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
        answerNationalProject_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        answer_id: INTEGER(11),
        nationalProject_id: INTEGER(11), //国家项目
        name: STRING(150), //项目名称
        type: INTEGER(2), //项目种类
        aidingWays: INTEGER(2), //*资助方式
        aidingNum: INTEGER(11), // 资助金额

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const AnswerNationalProject = app.model.define('answerNationalProject', model, {
        paranoid: true
    })
    AnswerNationalProject.associate = function() {
        AnswerNationalProject.belongsTo(app.pgModel.Answer,{foreignKey:'answer_id'})
        // companyQualification.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
    }
    AnswerNationalProject.model = model
    return AnswerNationalProject
}
