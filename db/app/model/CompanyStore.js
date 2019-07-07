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
        companyStore_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        park_id: INTEGER(11),
        user_id: INTEGER(11),
        company_id: INTEGER(11),
        regionCompany_id: INTEGER(11),

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const CompanyStore = app.model.define('companyStore', model, {
        paranoid: true
    })
    CompanyStore.associate = function() {
        CompanyStore.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
        // companyStore.hasMany(app.pgModel.OperationPermission)
    }
    CompanyStore.model = model
    return CompanyStore
}
