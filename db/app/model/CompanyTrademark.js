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
        //商标
        companyTrademark_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        company_id: INTEGER(11),
        image: STRING(300), //图片

        name: STRING(200), // 专利名称
        //flag: INTEGER(3), //  当前状态
        status: INTEGER(3), // 当前状态
        registerNo: STRING(80), // 注册号
        interClass: INTEGER(5), // 国际分类
        flowClass: STRING(100), //  流程状态

        applicant: STRING(500), // 申请人

        //trademarkType: STRING(80), //  流程分类 ？

        fristAuditNo: STRING(15), // 初审号
        applicationStatus: STRING(30), // 申请状态
        applicationDate: DATEONLY, // 申请日期

        applicationAdress: STRING(500), // 申请地址
        agent: STRING(30), // 代理机构

        //缺：注册公告号， 使用期限 ，商品列表
        regIssue: STRING(15), //注册公告号
        //liveTime: STRING(150), // 使用期限
        liveTime_start: DATEONLY, // 使用开始日期
        liveTime_end: DATEONLY, // 使用结束日期
        productServiceList: TEXT, // 商品服务列表
        accessory:TEXT,//附件
        //===========
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const CompanyTrademark = app.model.define('companyTrademark', model, {
        paranoid: true
    })
    CompanyTrademark.associate = function() {
        CompanyTrademark.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
        CompanyTrademark.hasMany(app.pgModel.TrademarkFlow, { foreignKey: 'companyTrademark_id' })
    }
    CompanyTrademark.model = model
    return CompanyTrademark
}
