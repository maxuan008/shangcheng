module.exports = app => {
    const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize
    //园区，服务内容关联表 
    const model = {
        parkIncubationServices_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },

        park_id: INTEGER(11), //园区
        // confIncubationServices_id: STRING(30), // 名字
        name: STRING(100), //孵化服务内容

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const ParkIncubationServices = app.model.define('parkIncubationServices', model, {
        paranoid: true
    })

    ParkIncubationServices.associate = function () {
        ParkIncubationServices.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
    }

    ParkIncubationServices.model = model
    return ParkIncubationServices
}
