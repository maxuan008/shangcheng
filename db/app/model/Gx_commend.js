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
        gx_commend_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        park_id: INTEGER(11),  //
        company_id: INTEGER(11), 
        companyOtherNeeds:TEXT, //企业其他需求
        interviewRemark: TEXT, //访谈备注

        informant:INTEGER(11),    //填报人是一个user_id
        tdfoh:DATEONLY ,   //填报时间

        
        trackStatus: INTEGER(3),   //企业跟踪状态，1推荐拜访  2数据更新  3已评定高新 4.不需要跟踪
        commend_resason:INTEGER(3) ,//推荐理由
        commend_date:DATEONLY,  //推荐时间
        dataSource:STRING(200) ,//最新数据来源
        dataUpdateTime:DATE ,  //最新更新时间
        updater: INTEGER(11),  //数据更新人

        datas:TEXT,  //集合数据
        isSubmit: { type: INTEGER(3), defaultValue: 0 }, //是否提交 0否  1是
        key: STRING(100) ,       //UUI用于链接的
        password: STRING(200) ,  //密码 

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const Gx_commend = app.model.define('gx_commend', model, {
        paranoid: true
    })
    Gx_commend.associate = function() {
        Gx_commend.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
        Gx_commend.belongsTo(app.pgModel.User,{foreignKey: 'updater' })
        // Gx_commend.hasMany(app.pgModel.OperationPermission)
    }
    Gx_commend.model = model
    return Gx_commend
}
