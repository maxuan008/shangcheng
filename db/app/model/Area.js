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
        area_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        name: STRING(50), // 地名
        father_id: INTEGER(11), //
        root_id: INTEGER(11), //'-1'为总节点

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效

        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const Area = app.model.define('area', model, {
        paranoid: true
    })
    Area.associate = function() {
        Area.belongsToMany(app.pgModel.Park, { through: 'areaPark', foreignKey: 'area_id' })
        Area.hasMany(app.pgModel.Spider, { foreignKey: 'area_id' })
        // Area.hasMany(app.pgModel.OperationPermission)
    }
    Area.model = model
    return Area
}
