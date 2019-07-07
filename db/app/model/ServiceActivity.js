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
        serviceActivity_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        park_id: INTEGER(11),
        name: STRING(150), //服务名
        type: STRING(100), //服务类型: 详细类型待定

        server: STRING(200), //服务机构
        company: STRING(300), //企业
        serviceDate: DATEONLY, //服务时间
        serviceAddress: STRING(200), //服务地址
        introduce: TEXT, //服务介绍

        //新增
        start_time: DATE, //开始时间
        end_time: DATE, //结束时间
        area_id: STRING(300), //地区
        // area: STRING(300), //地区
        intro: TEXT, //简介
        activeSlogan: STRING(300), // 活动标语
        guidance: STRING(200), //指导单位
        //sponsor :     //
        organizer: STRING(200), //承办单位
        co_organizer: STRING(200), //协办单位
        contact: STRING(80), //联系方式
        personNum: INTEGER(11), //活动、培训人数
        //agenda :   //活动内容议程
        confActiveType_id: INTEGER(11), //活动类别
        activeStyle: INTEGER(2), //活动类型
        //新加字段
        // entrepreneursActiveType: INTEGER(3), //创业活动类别
        confEntrepreneursActiveType_id: INTEGER(11), //创业活动类别
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const ServiceActivity = app.model.define('serviceActivity', model, { paranoid: true })
    ServiceActivity.associate = function() {
        ServiceActivity.hasMany(app.pgModel.ServiceActivityFile, {
            foreignKey: 'serviceActivity_id'
        })
        ServiceActivity.belongsToMany(app.pgModel.File, {
            through: 'ServiceActivityFile',
            foreignKey: 'serviceActivity_id'
        })
        ServiceActivity.belongsTo(app.pgModel.ConfActiveType, { foreignKey: 'confActiveType_id' })
        ServiceActivity.belongsTo(app.pgModel.ConfEntrepreneursActiveType, {
            foreignKey: 'confEntrepreneursActiveType_id'
        })
    }
    ServiceActivity.model = model
    return ServiceActivity
}
