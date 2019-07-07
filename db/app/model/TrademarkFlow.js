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
        //申请流程
        trademarkFlow_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        companyTrademark_id: INTEGER(11),
        flowDate: DATEONLY, // 申请日期
        flowText: STRING(150), //流程具体内容

        //===========
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const TrademarkFlow = app.model.define('trademarkFlow', model, {
        paranoid: true
    })
    TrademarkFlow.associate = function() {
        TrademarkFlow.belongsTo(app.pgModel.CompanyTrademark, { foreignKey: 'companyTrademark_id' })
    }
    TrademarkFlow.model = model
    return TrademarkFlow
}
