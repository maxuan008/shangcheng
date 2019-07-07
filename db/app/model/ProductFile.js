module.exports = app => {
    const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

    const model = {

        productFile_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },
        product_id: INTEGER(11),
        file_id: STRING(85),//file外键

        flag: INTEGER(2), //1:图片 2:视频
        url: STRING(300),//视频地址

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

    }

    const ProductFile = app.model.define('productFile', model, {
        paranoid: true
    })
    ProductFile.associate = function () {
        ProductFile.hasMany(app.pgModel.File, { foreignKey: 'file_id'})
        ProductFile.belongsTo(app.pgModel.Product, { foreignKey: 'product_id' })
    }
    ProductFile.model = model
    return ProductFile
}