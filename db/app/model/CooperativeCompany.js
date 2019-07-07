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
        cooperativeCompany_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },

        company_id: INTEGER(11),
        name: STRING(100),

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const CooperativeCompany = app.model.define('cooperativeCompany', model, {
        paranoid: true
    })
    CooperativeCompany.associate = function() {
        CooperativeCompany.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
    }
    CooperativeCompany.model = model
    return CooperativeCompany
}
