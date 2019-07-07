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
        BIGINT,
        FLOAT
    } = app.Sequelize

    const model = {
        heightCopmanyFile_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        company_id: INTEGER(11), //源文件名
        file_id: STRING(85), //文件类型

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const HeightCopmanyFile = app.model.define('heightCopmanyFile', model, {
        paranoid: true
    })
    HeightCopmanyFile.associate = function() {
        HeightCopmanyFile.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
        HeightCopmanyFile.belongsTo(app.pgModel.File, { foreignKey: 'file_id' })
    }
    HeightCopmanyFile.model = model
    return HeightCopmanyFile
}
