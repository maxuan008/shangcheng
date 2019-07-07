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
        talentRecruit_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        // talentRecruit_id: INTEGER(11),
        type: STRING(20),//岗位类别
        company_id: INTEGER(11),
        companyNeed_id: INTEGER(11),
        position: STRING(20), //职位
        wageScope: STRING(50), //薪资范围
        workCity: STRING(20), //工作地点
        workExperience: STRING(10), //工作经验
        publishTime:DATEONLY, //发布时间
        source: STRING(30), //来源
        url:STRING(200)  ,//地址
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const TalentRecruit = app.model.define('talentRecruit', model, {
        paranoid: true
    })
    TalentRecruit.associate = function() {
        TalentRecruit.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
        TalentRecruit.belongsTo(app.pgModel.CompanyNeed, { foreignKey: 'companyNeed_id' })
    }
    TalentRecruit.model = model
    return TalentRecruit
}
