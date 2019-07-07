module.exports = app => {
    const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize
    const model = {
        serviceActivityFile_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },

        serviceActivity_id: INTEGER(11),
        file_id: STRING(85),

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }
    const ServiceActivityFile = app.model.define('serviceActivityFile', model, { paranoid: true });
    ServiceActivityFile.associate = function () {
        ServiceActivityFile.belongsTo(app.pgModel.ServiceActivity, { foreignKey: 'serviceActivity_id' })
        ServiceActivityFile.belongsTo(app.pgModel.File, { foreignKey: 'file_id' })
    }
    ServiceActivityFile.model = model
    return ServiceActivityFile


}