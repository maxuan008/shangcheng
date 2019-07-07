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
        DOUBLE
    } = app.Sequelize

    const model = {
        companyOperation_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        company_id: INTEGER(11),

        // 经营信息 -------------------------------------
        year: INTEGER, // 所属年份
        month:INTEGER,//所属月份
        yearlyIncoming: BIGINT, // 本年度总收入
        netProfit: BIGINT, // 净利润
        exportSum: BIGINT, // 出口总额
        yearlyRDFund: BIGINT, // 年度研究与试验发展经费
        taxPayed: BIGINT, // 实际上缴税费

        //新增字段
        researchOrganization: INTEGER(11), //研发机构
        TotalNumberAchievements: INTEGER(11), //成果转化总数
        collegesNum: INTEGER(11), //其中：依托高校数量
        winningAchievements: INTEGER(11), //获奖成果
        outputResults: INTEGER(11), //产出成果
        incubatorGDP: BIGINT(20), //在孵企业工业总产值

        acceptPlanProject: INTEGER(11), //承担各类计划项目
        nationalProject: INTEGER(11), //其中：国家级项目
        scientificExpenditure: BIGINT(20), //科技活动经费支出总额
        researchExpenditures: BIGINT(20), //其中：研究与试验发展支出
        newProductExpenditure: BIGINT(20), //其中：新产品开发经费支出
        governmentGrants: BIGINT(20), //其中：政府拨款
        self_collected: BIGINT(20), //企业自筹

        // 国家政策支持 -------------------------------------
        nationalRDProject: INTEGER, // 承担国家科研和产业化项目（项）
        nationalRDFinancing: BIGINT, // 承担国家科研和产业化获得资助（元）
        ProvinceRDProject: INTEGER, // 承担省市区科研开发项目（项）
        // ProvinceAward:INTEGER,//获得省级以上奖励（项）
        ProvinceRDFinancing: BIGINT, // 承担省市区科研开发项目获得资助金额（元）

        // 合作的服务机构 -------------------------------------
        businessService: STRING(1500), // 商务服务类
        accountingService: STRING(1500), // 会计服务
        financingService: STRING(1500), // 融资服务
        hrService: STRING(1500), // 人力服务
        projectApplicationService: STRING(1500), // 项目申报
        smeConsultingService: STRING(1500), // 中小企业创业顾问
        publicTechnologyService: STRING(1500), // 公共技术服务平台
        financeIntegrationService: STRING(1500), // 金融集成创新服务
        lifeSupportingService: STRING(1500), // 生活配套服务

        //新增字段0
        writeUserName: STRING(150), //数据填报人
        contactNumber: STRING(20), //联系电话
        companyPrincipal: STRING(150), //单位负责人
        statisticsPrincipal: STRING(150), //统计负责人

        //新增字段
        co_pay:BIGINT, //上缴税费

        //1.0新增 
        technologyContractCount: BIGINT,//技术合同交易数量
        technologyContractSum:BIGINT,//技术合同交易额
        provinceAward:INTEGER,//获得省级以上奖励（项）
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const CompanyOperation = app.model.define('companyOperation', model, {
        paranoid: true
    })
    CompanyOperation.associate = function() {
        CompanyOperation.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
        CompanyOperation.hasMany(app.pgModel.NationalProject, { foreignKey: 'companyOperation_id' })
        // companyOperation.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
    }
    CompanyOperation.model = model
    return CompanyOperation
}
