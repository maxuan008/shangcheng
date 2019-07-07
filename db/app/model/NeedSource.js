module.exports = app => {

    const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

    const model = {
        needSource_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },

        companyNeed_id: INTEGER(11),

        pay: STRING(100), //薪资
        experience: STRING(100), //经验
        education: STRING(50), //学历
        postDuties: TEXT, //岗位职责
        title:STRING(100),
        
        publishDate: DATEONLY, //时间
        infoSource: STRING(200),  //信息来源
        url: STRING(100),  //信息来源url
        content: TEXT,    //需求内容

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }
    const NeedSource = app.model.define('needSource', model, {
        paranoid: true
    })
    NeedSource.associate = function () {
        NeedSource.belongsTo(app.pgModel.CompanyNeed, { foreignKey: 'companyNeed_id' })
    }
    NeedSource.model = model
    return NeedSource

}