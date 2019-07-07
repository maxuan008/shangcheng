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
        regionHatchStatus_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        regionCompany_id: INTEGER(11),
        name: STRING(200),
        status_id: INTEGER(11), //状态id

        isValid: { type: INTEGER(2), defaultValue: 1 },       //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const RegionHatchStatus = app.model.define('regionHatchStatus', model, {
        paranoid: true
    })
    RegionHatchStatus.associate = function () {
        RegionHatchStatus.belongsTo(app.pgModel.RegionCompany, { foreignKey: 'regionCompany_id' })
        // policy.hasMany(app.pgModel.OperationPermission)
    }
    RegionHatchStatus.model = model
    return RegionHatchStatus
}
