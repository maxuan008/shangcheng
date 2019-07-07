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
        BIGINT
    } = app.Sequelize

    const model = {
        companyBusinessFiles_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        company_id: INTEGER(11),
        companyFiles_id: INTEGER(11),

        name: STRING(100), //企业名称
        business: STRING(2000), //主营业务
        companyType: STRING(100), //公司类型
        address: STRING(200), //企业地址
        socialCreditCode: STRING(30), //统一社会信用代码

        biz_license_registration_code: STRING(100), //注册号
        biz_license_paidin_capital: BIGINT(30), //实收资本
        biz_license_serial_number: STRING(100), //证照编号
        biz_license_composing_form: STRING(100), //组成形式
        biz_license_operating_period: STRING(100), //营业期限

        registeredCapital: BIGINT(30), //注册资本
        legalRepresentative: STRING(30), //法定代表人
        operationRange: STRING(2000), //经营范围
        establishmentDate: DATEONLY, //成立日期

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const CompanyBusinessFiles = app.model.define('companyBusinessFiles', model, {
        paranoid: true
    })
    CompanyBusinessFiles.associate = function() {
        CompanyBusinessFiles.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
        CompanyBusinessFiles.belongsTo(app.pgModel.CompanyFiles, {
            foreignKey: 'companyFiles_id'
        })
        // companyFiles.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
    }
    CompanyBusinessFiles.model = model
    return CompanyBusinessFiles
}
