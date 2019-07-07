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
        nationalProject_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        companyOperation_id: INTEGER(11),
        name: STRING(150), //项目名称
        type: INTEGER(2), //项目种类
        aidingWays: INTEGER(2), //*资助方式
        aidingNum: INTEGER(11), // 资助金额
        itemLevel:INTEGER(11),//项目级别  1国家  2 省市
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const NationalProject = app.model.define('nationalProject', model, {
        paranoid: true
    })
    NationalProject.associate = function() {
        NationalProject.belongsTo(app.pgModel.CompanyOperation, {
            foreignKey: 'companyOperation_id'
        })
        // companyOperation.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
    }
    NationalProject.model = model
    return NationalProject
}
