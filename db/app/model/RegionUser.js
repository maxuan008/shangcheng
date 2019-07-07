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
        regionUser_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        region_id: INTEGER(11),
        user_id: INTEGER(11),

        isValid: { type: INTEGER(2), defaultValue: 1 },       //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const RegionUser = app.model.define('regionUser', model, {
        paranoid: true
    })
    RegionUser.associate = function () {
        RegionUser.belongsTo(app.pgModel.Region, { foreignKey: 'region_id' })
        RegionUser.belongsTo(app.pgModel.User, { foreignKey: 'user_id' })
    }
    RegionUser.model = model
    return RegionUser
}
