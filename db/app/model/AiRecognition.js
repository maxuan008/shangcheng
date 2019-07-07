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
        aiRecognition_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        file_id: STRING(85), //图片地址
        field: STRING(255), //字段
        originalData: STRING(255), //原始数据
        recogniteData: STRING(255), //识别出来的数据
        isSure: { type: INTEGER(2), defaultValue: 0 }, //是否确认 0 未确认 1已确认

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const AiRecognition = app.model.define('aiRecognition', model, {
        paranoid: true
    })
    AiRecognition.associate = function() {
        // TagCount.hasMany(app.pgModel.User, { foreignKey: 'park_id' })
        AiRecognition.belongsTo(app.pgModel.File, { foreignKey: 'file_id' })
    }
    AiRecognition.model = model
    return AiRecognition
}
