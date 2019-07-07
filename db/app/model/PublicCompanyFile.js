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
        publicCompanyFile_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        company_id: INTEGER(11), //
        file_id: STRING(85), //

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const PublicCompanyFile = app.model.define('publicCompanyFile', model, {
        paranoid: true
    })
    PublicCompanyFile.associate = function() {
        PublicCompanyFile.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
        PublicCompanyFile.belongsTo(app.pgModel.File, { foreignKey: 'file_id' })
    }
    PublicCompanyFile.model = model
    return PublicCompanyFile
}
