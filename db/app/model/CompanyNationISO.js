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
        companyNationISO_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        company_id: INTEGER(11),
        isoName:    STRING(200),  //标准名称
        isoLevel:   STRING(200),  //标准级别:  国家  行业
        isoNum:     STRING(200),  //标准编号
        joinWay:    STRING(100),  //参与方式: 主持   参与

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const CompanyNationISO = app.model.define('companyNationISO', model, {
        paranoid: true
    })
    CompanyNationISO.associate = function() {
        CompanyNationISO.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
        // CompanyNationISO.hasMany(app.pgModel.OperationPermission)
    }
    CompanyNationISO.model = model
    return CompanyNationISO
}
