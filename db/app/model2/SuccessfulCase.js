module.exports = app => {
    const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize
    const model = {
        successfulCase_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },

        companyService_id: INTEGER(11),
        name: STRING(50),
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

    }
    const SuccessfulCase = app.devSeq.DevMysqlSeq.define('successfulCase', model, { paranoid: true });
    SuccessfulCase.associate = function () {
        SuccessfulCase.belongsTo(app.devModel.CompanyService,{foreignKey:'companyService_id'})
    }
    SuccessfulCase.model = model
    return SuccessfulCase
}