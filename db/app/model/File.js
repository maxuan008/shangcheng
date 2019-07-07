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
        file_id: {
            type: STRING(85),
            primaryKey: true,
            autoIncrement: true
        },

        fileName: STRING(150), //源文件名
        type: STRING(30), //文件类型

        sourcePath: STRING(200), //文件路径
        uuidName: STRING(300), //存储文件名
        remark: STRING(300), //文件备注,例: xxxx公司营业执照

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const File = app.model.define('file', model, {
        paranoid: true
    })
    File.associate = function() {
        File.belongsToMany(app.pgModel.Product,{foreignKey:'file_id',through:'productFile'})
        File.belongsToMany(app.pgModel.ServiceActivity,{foreignKey:'file_id',through:'ServiceActivityFile'})
        // File.belongsTo(app.pgModel.ProductFile,{foreignKey: 'file_id'})
    }
    File.model = model
    return File
}
