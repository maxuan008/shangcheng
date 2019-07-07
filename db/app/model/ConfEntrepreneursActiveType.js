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
        confEntrepreneursActiveType_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        park_id: INTEGER(11),
        name: STRING(50), //载体性质
        isSystemBuild: { type: INTEGER(2), defaultValue: 0 }, //是否系统生成

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const ConfEntrepreneursActiveType = app.model.define('confEntrepreneursActiveType', model, {
        paranoid: true
    })
    ConfEntrepreneursActiveType.associate = function() {
        ConfEntrepreneursActiveType.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
    }
    ConfEntrepreneursActiveType.model = model
    return ConfEntrepreneursActiveType
}
