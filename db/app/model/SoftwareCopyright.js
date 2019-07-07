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
        //软件著作权
        softwareCopyright_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        company_id: INTEGER(11),

        name: STRING(200), // 作品名称
        versionNo: STRING(80), // 作品名称
        publishedAt: DATEONLY, // 发布日期
        shortName: STRING(80), // 简称
        registerNo: STRING(80), // 登记号
        registerCompleteDate: DATEONLY, // 登记完成日期

        //===========
        //高新工具新增字段
        acquisitionMode:STRING(100), //获得方式：1自主研发  2转让  3独占许可
        scoreType:STRING(500), //高新评分类别
        isFirstGX: { type: INTEGER(3), defaultValue: 0 }, //是否为首次高新评定
        accessory:TEXT,//附件
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const SoftwareCopyright = app.model.define('softwareCopyright', model, {
        paranoid: true
    })
    SoftwareCopyright.associate = function() {
        SoftwareCopyright.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
    }
    SoftwareCopyright.model = model
    return SoftwareCopyright
}
