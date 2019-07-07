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
        companyShareholders_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        company_id: INTEGER(11),
        name: STRING(100),
        position: INTEGER(4), //含义：
        holdingRate: DECIMAL(10, 5), //持股比例
        investmentAmount: STRING(100), //认缴出资额
        type: INTEGER(2), //含义
        //新加字段
        ID_number: STRING(100), //身份证号
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const CompanyShareholders = app.model.define('companyShareholders', model, {
        paranoid: true
    })
    CompanyShareholders.associate = function() {
        CompanyShareholders.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
        // companyShareholders.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
    };
    CompanyShareholders.model = model
    return CompanyShareholders
};
