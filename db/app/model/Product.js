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
        product_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        company_id: INTEGER(11),
        park_id: INTEGER(11),
        name: STRING(150), //产品名
        industry: STRING(150), //所属行业
        joinDate: DATEONLY, //入住日期
        joinAddress: STRING(350), //入住地址
        contact: STRING(50), //联系人
        contactNumber: STRING(20), //联系电话
        details: TEXT, //需求描述
        advantage: TEXT,
        winLog: STRING(200), //获奖记录
        officialWeb: STRING(200), //官网
        isfinance: { type: INTEGER(2), defaultValue: 0 }, //是否融资 ：0未融资 1已融资

        //新增字段
        isNationalLeve: INTEGER(2), //是否为国家级项目
        productType: INTEGER(2), //*项目种类
        aidingWays: INTEGER(2), //*资助方式
        aidingNum: INTEGER(11), // 资助金额
        achievementClass: INTEGER(2), //成果类别
        tecMaturity: INTEGER(2), //  技术成熟度
        formsOfCooperation: INTEGER(2), //合作形式
        //fieldOfTechnology: INTEGER(2),     //技术领域
        advantageAnalysis: STRING(1000), //*与同类成果相比的优势分析(500字)

        //更改
        confFieldOfTechnology_id: INTEGER(11), //技术领域
        //高新工具新增字段
        developmentCycle: STRING(200), //产品开发周期：（区间）
        salesRevenueForLastYear: INTEGER(11), //产品上年度销售收入：（万元）
        patantNum: STRING(80), //产品相关知识产权编号：
        techSource: STRING(200), //产品相关技术来源：
        RDexpenses: INTEGER(11), //产品研发费用总预算：
        RDexpenses3yearTotal: INTEGER(11), //研发费用近三年支出
        RDexpenses1year: INTEGER(11), //研发费用第一年支出
        RDexpenses2year: INTEGER(11), //研发费用第二年支出
        RDexpenses3year: INTEGER(11), //研发费用第三年支出

        //新增字段
        applyField: STRING(20), //适用领域
        year: INTEGER(3), //产品使用年份
        cooperative: STRING(20), //合作伙伴
        fieldOfTechnology: STRING(20), //技术领域
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const Product = app.model.define('product', model, {
        paranoid: true
    })
    Product.associate = function() {
        Product.belongsToMany(app.pgModel.File, {
            foreignKey: 'product_id',
            through: 'productFile'
        })
        Product.hasMany(app.pgModel.ProductFile, { foreignKey: 'product_id' })
        Product.hasMany(app.pgModel.ProductTalent, { foreignKey: 'product_id' })
        Product.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
        Product.belongsToMany(app.pgModel.Talent, {
            foreignKey: 'product_id',
            through: 'productTalent'
        })
    }
    Product.model = model
    return Product
}
