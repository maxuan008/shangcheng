module.exports = app => {
    const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

    const model = {

        recognition_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        regionCompany_id: INTEGER(11),
        year: STRING(10),
        month: STRING(10),

        companyInfo: INTEGER(3), 	 //企业信息
        interview: INTEGER(3),  	//访谈数据
        intellectualPropertyRight: INTEGER(3),    //知识产权
        product: INTEGER(3),        //产品信息
        humanResources: INTEGER(3),        //人力资源
        companyOperation: INTEGER(3),       //经营状况

        isValid: { type: INTEGER(2), defaultValue: 1 },       //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const Recognition = app.model.define('recognition', model, {
        paranoid: true
    })
    Recognition.associate = function () {
        Recognition.belongsTo(app.pgModel.RegionCompany, { foreignKey: 'regionCompany_id' })
        // CompanyStatus.belongsTo(app.pgModel.ConfCompanyInfoType, { foreignKey: 'confCompanyInfoType_id' })
        // companyFiles.hasMany(app.pgModel.User,{foreignKey: 'park_id'})

    }
    Recognition.model = model
    return Recognition
}