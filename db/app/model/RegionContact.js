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
        FLOAT
    } = app.Sequelize

    const model = {
        regionContact_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        regionCompany_id: INTEGER(11),
        name: STRING(100),
        tel: STRING(50),

        isValid: { type: INTEGER(2), defaultValue: 1 },       //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const RegionContact = app.model.define('regionContact', model, {
        paranoid: true
    })
    RegionContact.associate = function () {
        RegionContact.hasMany(app.pgModel.RegionCompany, { foreignKey: 'regionCompany_id' })
        // policy.hasMany(app.pgModel.OperationPermission)
    }
    RegionContact.model = model
    return RegionContact
}
