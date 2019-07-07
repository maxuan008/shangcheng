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
        confIncubationServices_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        park_id: INTEGER(11),
        name: STRING(50), //孵化服务内容
        isSystemBuild: { type: INTEGER(2), defaultValue: 0 }, //是否系统生成

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const ConfIncubationServices = app.model.define('confIncubationServices', model, {
        paranoid: true
    })
    ConfIncubationServices.associate = function() {
        ConfIncubationServices.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
    }
    ConfIncubationServices.model = model
    return ConfIncubationServices
}
