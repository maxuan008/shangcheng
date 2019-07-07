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
        //作品著作权
        worksCopyright_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        company_id: INTEGER(11),

        name: STRING(200), // 作品名称
        fristPublicDate: DATEONLY, // 申请日期
        completionDate: DATEONLY, //  完成日期
        registerNo: STRING(80), // 登记号
        registerDate: DATEONLY, // 登记日期
        registerType: INTEGER(5), // 登记类别
        accessory:TEXT,//附件
        //===========
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const WorksCopyright = app.model.define('worksCopyright', model, {
        paranoid: true
    })
    WorksCopyright.associate = function() {
        WorksCopyright.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
    }
    WorksCopyright.model = model
    return WorksCopyright
}
