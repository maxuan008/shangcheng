module.exports = app => {
    const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize
    const model = {
        companyService_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },
        park_id: INTEGER(11),

        image: STRING(80),  //图片
        title: STRING(150),  //服务标题
        issuer: STRING(100), //发布单位
        details: TEXT,   //正文


        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }
    const CompanyService = app.model.define('companyService', model, { paranoid: true });
    CompanyService.associate = function () {
        CompanyService.hasMany(app.pgModel.SuccessfulCase,{foreignKey:'companyService_id'})
    }
    CompanyService.model = model
    return CompanyService
}