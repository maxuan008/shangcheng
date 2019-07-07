module.exports = app => {
    const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

    const model = {

        companyStatus_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        company_id: INTEGER(11),
        name: STRING(150),
        status_id: INTEGER(11), //状态id

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

    }

    const CompanyStatus = app.model.define('companyStatus', model, {
        paranoid: true
    })
    CompanyStatus.associate = function () {
        CompanyStatus.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
        // CompanyStatus.belongsTo(app.pgModel.ConfCompanyInfoType, { foreignKey: 'confCompanyInfoType_id' })
        // companyFiles.hasMany(app.pgModel.User,{foreignKey: 'park_id'})

    }
    CompanyStatus.model = model
    return CompanyStatus
}