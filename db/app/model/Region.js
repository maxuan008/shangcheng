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
        region_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        park_id: INTEGER(11),
        name: STRING(300),
        teamType: { type: INTEGER(2), allowNull: false }, //1:在孵库分区   2：团队库分区

        isValid: { type: INTEGER(2), defaultValue: 1 },       //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const Region = app.model.define('region', model, {
        paranoid: true
    })
    Region.associate = function () {
        Region.hasMany(app.pgModel.RegionUser, { foreignKey: 'region_id' })
        Region.hasMany(app.pgModel.RegionCompany, { foreignKey: 'region_id' })
    }
    Region.model = model
    return Region
}
