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
        FLOAT
    } = app.Sequelize

    const model = {
        park_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        logo: STRING(85),
        name: STRING(50), // 名称
        //新增字段
        hostType: INTEGER(2), //载体类型
        hostName: STRING(200), //  载体名称
        organizationName: STRING(200), //  运营机构名称
        establishmentDate: DATEONLY, //  成立时间
        registerDate: DATEONLY, //   注册时间
        socialCreditCode: STRING(200), //   社会信用代码
        unitPrice: FLOAT, //空间单价
        hostLevel: INTEGER(2), //  载体级别
        hostProperty: STRING(100), //  载体性质
        acreage: FLOAT, //  载体总面积:(平方米)
        usableAcreage: FLOAT, //  在孵企业及团队可使用场地面积:(平方米)
        parkImage: STRING(85), //    园区图片
        corporateName: STRING(50), //   法人姓名
        corporate_ID: STRING(30), //   法人身份证号
        corporateSex: INTEGER(2), //  法人性别  1男  2女
        corporateEmail: STRING(300), //  法人邮箱
        contactName: STRING(50), //  联系人名字
        contactNum: STRING(50), // 联系人电话
        contactEmail: STRING(300), //  联系人邮箱
        contactTel: STRING(50), // 联系人手机
        hostIntro: TEXT, //  载体简介
        matingService: TEXT, //  配套服务
        recruitingObject: TEXT, //  招募对象
        hostMatingDiscounts: TEXT, //  载体配套优惠
        authenticationStatus: INTEGER(2), //  认证状态

        label: STRING(300), //   标签
        facilities: STRING(300), //   具备设施
        incubationServices: STRING(300),
        hostAdress: STRING(200), //   载体地址
        iterationTxt: TEXT,//迭代说明
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const Park = app.model.define('park', model, {
        paranoid: true
    })
    Park.associate = function() {
        Park.belongsToMany(app.pgModel.Area, { through: 'areaPark', foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.Company, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.User, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfTag, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfSetParkAddress, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfNeed, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfParkAddress, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfTalentPlan, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfIndustryConcern, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfQualification, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfStateOccupancy, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfCompanyInfoType, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfServerClass, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfServerType, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfJoinWork, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfCompanyClass, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.Talent, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ParkCount, { foreignKey: 'park_id' })
        // Park.belongsToMany(app.pgModel.User, { foreignKey: 'park_id', through: 'moreParkManger' })
        Park.hasMany(app.pgModel.MoreParkManger, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfFieldOfTechnology, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfMentors, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfActiveType, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfIncubationServices, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfHostProperty, { foreignKey: 'park_id' })

        Park.hasMany(app.pgModel.ParkIncubationServices, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.ConfEntrepreneursActiveType, { foreignKey: 'park_id' })
        Park.hasMany(app.pgModel.PolicySource,{foreignKey:'park_id'})
        Park.hasMany(app.pgModel.Policy, { foreignKey: 'park_id' })
    }
    Park.model = model
    return Park
}
