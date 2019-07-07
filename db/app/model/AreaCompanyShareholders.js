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
        areaCompanyShareholders_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        areaCompany_id: INTEGER(11),
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

    const AreaCompanyShareholders = app.model.define('areaCompanyShareholders', model, {
        paranoid: true
    })
    AreaCompanyShareholders.associate = function() {
        AreaCompanyShareholders.belongsTo(app.pgModel.AreaCompany, { foreignKey: 'areaCompany_id' })
        // companyShareholders.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
    }
    AreaCompanyShareholders.model = model
    return AreaCompanyShareholders
}
