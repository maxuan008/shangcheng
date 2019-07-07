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
        confFieldOfTechnology_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },

        park_id:INTEGER(11),
        name: STRING(50), //技术领域
        isSystemBuild:{type:INTEGER(2) , defaultValue: 0  }, //是否系统生成
    
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const ConfFieldOfTechnology = app.model.define('confFieldOfTechnology', model, {
        paranoid: true
    })
    ConfFieldOfTechnology.associate = function() {
        ConfFieldOfTechnology.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
        ConfFieldOfTechnology.hasMany(app.pgModel.Talent, { foreignKey: 'confFieldOfTechnology_id' })
    }
    ConfFieldOfTechnology.model = model
    return ConfFieldOfTechnology
}
