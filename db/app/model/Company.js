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
        company_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        teamType: { type: INTEGER(2), defaultValue: 1 }, //1:公司   2：团队  3.学生创业团队 4.学生创业企业 5.创业人员（团队）

        park_id: INTEGER(11),
        confStateOccupancy_id: INTEGER(11), //入住状态
        hatchStatus: { type: INTEGER(2), defaultValue: 1 }, //在孵状态 1:在孵 0：未在孵
        lib: INTEGER(2), //所在库：1.入住企业库、2.团队库、3.离园企业库、
        leaveTime: DATE, //离园时间
        confCompanyClass_id: INTEGER(11), //企业类别

        name: STRING(100), //企业名称
        business: STRING(2000), //主营业务
        entryTime: DATEONLY, //入园日期
        teamSize: INTEGER(8), //团队规模
        address: STRING(200), //企业地址
        remark: STRING(1000), //备注信息

        prjName: STRING(100), //服务项目
        startJoinDate: DATEONLY, //合作开始时间
        contact: STRING(100), //联系人
        logo: STRING(50),
        contactNumber: STRING(20), //联系电话

        socialCreditCode: STRING(30), //统一社会信用代码
        registeredCapital: BIGINT(30), //注册资本

        legalRepresentative: STRING(30), //法定代表人
        establishmentDate: DATEONLY, //成立日期
        approvalDate: DATEONLY, //核准日期

        operationStatus: INTEGER(11), //1开业，2存续， 3吊销， 4注销
        operationTermStart: DATEONLY, //营业期限开始时间
        operationTermEnd: DATEONLY, //营业期限截止时间
        registerInstitution: STRING(100), //登记机关
        operationRange: STRING(2000), //经营范围
        registrationAddress: STRING(200), //注册地址
        companyType: STRING(200), //公司类型

        changeFlag: INTEGER(2), //1改变 , 0未改变
        changTime: DATE, //最近更新时间

        isCountIntelRight: { type: INTEGER(2), defaultValue: 0 }, //是否在孵 1:已统计 0：未统计
        yearCountIntelRight: { type: STRING(300), defaultValue: '[-1]' },
        url: STRING(100), //

        //-----新增字段
        //基本信息
        contactEmail: STRING(150), //联系人邮箱
        safetyResponsiblePerson: STRING(100), // 安全责任人：
        corporateIdentityCard: STRING(30), //法人身份证：
        corporateSex: INTEGER(2), //法人性别: 1男， 2女
        fristRegisteredCapital: BIGINT(20), //*企业成立时注册资本(万元)
        industryType: INTEGER(7), //行业类别
        typesOfCorporateTaxpayers: INTEGER(2), //企业纳税人类型:
        registerType: INTEGER(5), //企 业 登 记 注 册 类 型
        //-----》
        floorSpace: FLOAT, //占用场地面积 （平方米）:
        //企业属性
        // fieldOfTechnology: INTEGER(2), // 技术领域:
        isHeightCompany: INTEGER(2), //是否为高新企业:   "1、是  2、否"
        // heightCopmanyFile: STRING(85), //高新企业材料, 文件ID
        isPublicCompany: INTEGER(2), // 是否为上市企业:    "1、是  2、否"
        publicCompanyType: INTEGER(2), //上市类型:  "1主板 2中小板 3创业板  4国外资本市场  5新三板  6并购"
        stockCode: STRING(15), //股票代码
        listTime: DATEONLY, //上市时间
        // publicCompanyFile: STRING(85), //上市企业证明材料 :
        isStart_upCompany: INTEGER(2), //是否为创业企业:  "1、是  2、否"
        start_upType: INTEGER(2), // 创业类型 :
        isMentors: INTEGER(2), //创业导师:  "1、是  2、否"
        isContinuity: INTEGER(2), //企业主要负责人是否为连续创业者: "1、是  2、否"
        AngelCapitalNum: BIGINT(20), // 获天使或风险投资额（千元）:

        isGraduate: INTEGER(2), //是否为毕业企业  "1、是   2、否"
        graduateTime: DATEONLY, //毕业时间
        isBuildTutor: INTEGER(2), //是否与创业导师建立辅导关系 "1、是  2、否"
        principalSex: INTEGER(2), //主要负责人性别 "1、男  2、女"
        isCharacteristic: INTEGER(2), //主要负责人创业特征
        confFieldOfTechnology_id: INTEGER(11), // 技术领域:  fieldOfTechnology
        //新加字段
        responsiblePersonContactNumber: STRING(20), //责任人联系电话

        //新加字段
        tagFlag: { type: INTEGER(2), defaultValue: 0 }, // 0:未获取标签， 1:已获取标签
        tags: STRING(800), //标签集合
        cognizanceTime: DATEONLY, //认定时间
        isFirstCognizance: INTEGER(2), //是否首次认定 1是 2 否

        //高新工具新增字段

        high_tech_duetime: DATEONLY, //高新到期时间
        // foreignInvestmentSource: STRING(200), //外资来源地
        // scale: STRING(200), //企业规模
        // taxAuthority: STRING(100), //企业所得税主管税务机关 "国税 地税"
        // wayOfTax: STRING(100), //企业所得税征收方式   "查账征收核定征收"
        explanationIndustryUniversity: TEXT, //产学研合作说明：
        isExplanationUniversity: INTEGER(3), //是否与国内外研究开发机构开展多种形式产学研合作："1是 0否"

        //新加字段
        teamName: STRING(100), //（团队）名称
        projectDescribe: STRING(100), //项目介绍
        // industryField: STRING(100), //行业领域
        product: STRING(100), //产品（服务）
        headName: STRING(100), //主要负责人姓名
        headContactNumber: STRING(100), //负责人联系方式
        headIdentityCard: STRING(100), //负责人身份证号码
        headEmail: STRING(100), //负责人邮箱
        studentId: STRING(100), //学号
        studentGrade: STRING(100), //学院专业年级
        contactIdentityCard: STRING(100), //联系人身份证
        occupancyArea: FLOAT, //计划入驻面积
        multifiles: STRING(300), //材料
        serviceNeeds: STRING(1000), //服务需求
        proposer: STRING(100), //申请人
        applicationDate: DATE, //申请日期
        stateOccupancy: { type: INTEGER(2), defaultValue: 1 }, //入驻状态（必选）1.实体入孵 2.虚拟入孵
        applicationStatus: { type: INTEGER(2), defaultValue: 1 }, //1.待审核 2.未通过 3.已通过
        downloadTimes: INTEGER(11), //下载次数
        headAddress: STRING(100), //负责人住址
        contactAddress: STRING(100), //联系人住址
        isRegion: { type: INTEGER(2), defaultValue: 0 }, //是否分配区域

        //v_0.8修改字段
        // foreignInvestmentSource: INTEGER(5), //外资来源地
        // scale: INTEGER(5), //企业规模
        // taxAuthority: INTEGER(5), //企业所得税主管税务机关
        // wayOfTax: INTEGER(5), //企业所得税征收方式
        foreignInvestmentSource: STRING(200),   //外资来源地
        scale: STRING(200),   //企业规模 
        taxAuthority: STRING(100),  //企业所得税主管税务机关 "国税 地税"
        wayOfTax: STRING(100),  //企业所得税征收方式   "查账征收核定征收"
        //v_0.8新增字段
        fieldOfTechnology: STRING(20), //技术领域
        companyWechatPublicAccount: STRING(30), //企业微信公众号全称
        recognition:INTEGER,//打分
        contacts: TEXT,  //联系人集合

        //1.2新增字段
        cooperateOrganization:STRING,//合作机构
        cooperateFiles:STRING(1000),//协议
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const Company = app.model.define('company', model, {
        paranoid: true,
        hooks:{
            afterUpdate:async (instance,options)=>{
                let {Company,ConfQualification}=app.pgModel
                let {company_id,isValid,lib}=instance.dataValues
                console.log(instance)
            }
        }
    })
    Company.associate = function() {
        Company.belongsTo(app.pgModel.ConfStateOccupancy, { foreignKey: 'confStateOccupancy_id' })
        Company.belongsTo(app.pgModel.ConfCompanyClass, { foreignKey: 'confCompanyClass_id' })
        Company.belongsTo(app.pgModel.ConfFieldOfTechnology, {
            foreignKey: 'confFieldOfTechnology_id'
        })
        Company.belongsToMany(app.pgModel.ConfTag, {
            through: 'companyConfTag',
            foreignKey: 'company_id'
        })
        Company.belongsToMany(app.pgModel.ConfQualification, {
            through: 'companyQualification',
            foreignKey: 'company_id'
        })
        Company.belongsToMany(app.pgModel.ConfCompanyInfoType, {
            through: 'companyFiles',
            foreignKey: 'company_id'
        })
        Company.hasMany(app.pgModel.CompanyEmployees, { foreignKey: 'company_id' })
        Company.hasMany(app.pgModel.CompanyShareholders, { foreignKey: 'company_id' })
        Company.hasMany(app.pgModel.CompanyIntelRight, { foreignKey: 'company_id' })
        Company.hasMany(app.pgModel.CompanyNeed, { foreignKey: 'company_id' })
        Company.hasMany(app.pgModel.CompanyOperation, { foreignKey: 'company_id' })
        Company.hasMany(app.pgModel.CompanyPatent, { foreignKey: 'company_id' })
        Company.hasMany(app.pgModel.CompanyNews, { foreignKey: 'company_id' })
        Company.hasMany(app.pgModel.CompanyFinancing, { foreignKey: 'company_id' })
        Company.hasMany(app.pgModel.Talent, { foreignKey: 'company_id' })
        Company.hasMany(app.pgModel.CompanyTalentStat, { foreignKey: 'company_id' })
        Company.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
        Company.hasMany(app.pgModel.CompanyFiles, { foreignKey: 'company_id', as: 'files' })
        //  Company.belongsTo(app.pgModel.ConfCompanyInfoType,{foreignKey:''})
        // Company.hasMany(app.pgModel.User,{foreignKey: 'park_id'})confCompanyInfoType
        Company.hasMany(app.pgModel.Product, { foreignKey: 'company_id' })
        Company.hasMany(app.pgModel.CompanyStore, { foreignKey: 'company_id' })
        // Company.hasMany(app.pgModel.CompanyNeeds, { foreignKey: 'company_id' })
        Company.hasMany(app.pgModel.CooperativeCompany, { foreignKey: 'company_id' })
        Company.hasMany(app.pgModel.PublicCompanyFile, { foreignKey: 'company_id' })
        Company.hasMany(app.pgModel.HeightCopmanyFile, { foreignKey: 'company_id' })
        Company.hasMany(app.pgModel.SoftwareCopyright, { foreignKey: 'company_id' })
        Company.hasMany(app.pgModel.CompanyNationISO, { foreignKey: 'company_id' })
        Company.hasMany(app.pgModel.TalentRecruit, { foreignKey: 'company_id' })
        Company.hasMany(app.pgModel.RegionCompany, { foreignKey: 'company_id' })
    }
    Company.model = model
    return Company
}
