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
        spider_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        area_id: INTEGER(2),
        name: STRING(50), //名称
        url: STRING(200), //链接

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const Spider = app.model.define('spider', model, {
        paranoid: true
    })
    Spider.associate = function() {
        Spider.belongsTo(app.pgModel.Area, { foreignKey: 'area_id' })
        // Spider.hasMany(app.pgModel.OperationPermission)
    }
    Spider.model = model
    return Spider
}
