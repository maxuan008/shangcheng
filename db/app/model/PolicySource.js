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
        policySource_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        
        park_id: STRING(85), 
        name: STRING(255), //渠道名
        url: STRING(255), //网址

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    
    }

    const PolicySource = app.model.define('policySource', model, {
        paranoid: true
    })
    
    PolicySource.associate = function() {
        PolicySource.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
        // companyFinancing.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
    }
    PolicySource.model = model
    return PolicySource
}
