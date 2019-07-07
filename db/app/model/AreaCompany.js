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
        areaCompany_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        park_id: INTEGER(11),
        name: STRING(100), //企业名称
        socialCreditCode: STRING(30), //统一社会信用代码
        companyType: INTEGER(5), //公司类型
        registeredCapital: BIGINT(30), //注册资本
        legalRepresentative: STRING(30), //法定代表人
        establishmentDate: DATEONLY, //成立日期
        operationTermStart: DATEONLY, //营业期限开始时间
        operationTermEnd: DATEONLY, //营业期限截止时间
        approvalDate: DATEONLY, //核准日期
        operationStatus: INTEGER(11), //1开业，2存续， 3吊销， 4注销
        registerInstitution: STRING(100), //登记机关
        operationRange: STRING(2000), //经营范围
        registrationAddress: STRING(200), //注册地址
        industryType: STRING(200), //行业类别

        area_type: { type: INTEGER(2), defaultValue: 0 }, //1.东北 2.华东 3.华北  4.华中  5.华南  6.西南  7.西北

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const AreaCompany = app.model.define('areaCompany', model, {
        paranoid: true
    })

    AreaCompany.associate = function() {
        AreaCompany.hasMany(app.pgModel.AreaCompanyEmployees, { foreignKey: 'areaCompany_id' })
        AreaCompany.hasMany(app.pgModel.AreaCompanyShareholders, { foreignKey: 'areaCompany_id' })
        AreaCompany.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
    }
    AreaCompany.model = model
    return AreaCompany
}
