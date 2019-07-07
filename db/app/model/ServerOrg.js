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
        BIGINT,
        STRING
    } = app.Sequelize

    const model = {
        serverOrg_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        park_id: INTEGER(11),
        name: STRING(100), //服务机构名称
        confServerClass_id: INTEGER(11), //机构类别
        confServerType_id: INTEGER(11), //服务类型

        prjName: STRING(1000), //服务项目
        startJoinDate: DATEONLY, //合作开始时间
        contact: STRING(100), //联系人
        logo: STRING(50),
        contactNumber: STRING(20), //联系电话
        address: STRING(200), //机构地址
        socialCreditCode: STRING(30), //统一社会信用代码
        registeredCapital: BIGINT(30), //注册资本

        legalRepresentative: STRING(30), //法定代表人
        establishmentDate: DATEONLY, //establishmentDate
        approvalDate: DATEONLY, //核准日期

        operationStatus: INTEGER(11), //1开业，2存续， 3吊销， 4注销
        operationTermStart: DATEONLY, //营业期限开始时间
        operationTermEnd: DATEONLY, //营业期限截止时间
        registerInstitution: STRING(100), //登记机关
        operationRange: STRING(2000), //经营范围
        registrationAddress: STRING(200), //注册地址
        companyType: INTEGER(5),

        changeFlag: INTEGER(2), //1改变 , 0未改变
        changTime: DATE, //最近更新时间

        //新增字段
        showImage: STRING(85), //展示图片：

        area_id: STRING(300), //所在地区 ：是字符串还是跟已有地区关联
        serverCharacter: INTEGER(2), //*服务机构性质
        intro: TEXT, //机构简介:
        serviceContent: TEXT, //中介服务内容
        corporateIdentityCard: STRING(25), //法人身份证
        corporateSex: INTEGER(2), //法人性别  1男  2女
        corporateEmail: STRING(100), //法人邮箱
        zipCode: STRING(15), //邮编
        contactEmail: STRING(100), //联系人邮箱
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const ServerOrg = app.model.define('serverOrg', model, {
        paranoid: true
    })
    ServerOrg.associate = function() {
        ServerOrg.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
        ServerOrg.belongsTo(app.pgModel.ConfServerClass, { foreignKey: 'confServerClass_id' })
        ServerOrg.belongsTo(app.pgModel.ConfServerType, { foreignKey: 'confServerType_id' })
        ServerOrg.belongsToMany(app.pgModel.ConfJoinWork, {
            through: 'joinWorkServerOrg',
            foreignKey: 'serverOrg_id'
        })
        ServerOrg.hasMany(app.pgModel.ServerShareholders, { foreignKey: 'serverOrg_id' })
        ServerOrg.hasMany(app.pgModel.ServerEmployees, { foreignKey: 'serverOrg_id' })
        ServerOrg.hasMany(app.pgModel.ServerQualification, { foreignKey: 'serverOrg_id' })
        ServerOrg.hasMany(app.pgModel.ServerAgreement, { foreignKey: 'serverOrg_id' })
        ServerOrg.hasMany(app.pgModel.ServerNews, { foreignKey: 'serverOrg_id' })
        ServerOrg.hasMany(app.pgModel.ServerSuccessfulCase, { foreignKey: 'serverOrg_id' })
        ServerOrg.hasMany(app.pgModel.Talent, { foreignKey: 'serverOrg_id' })
        // ServerOrg.hasMany(app.pgModel.JoinWorkServerOrg)
    }
    ServerOrg.model = model
    return ServerOrg
}
