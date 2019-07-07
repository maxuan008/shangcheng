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
        tag_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        park_id: INTEGER(2),
        flag: INTEGER(2), //1:企业新闻  2:园区新闻  3:行业新闻   4:政策
        tagName: STRING(50), //标签名
        count: { type: INTEGER(11), defaultValue: 0 }, //计数器

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const TagCount = app.model.define('tagCount', model, {
        paranoid: true
    })
    TagCount.associate = function() {
        // TagCount.hasMany(app.pgModel.User, { foreignKey: 'park_id' })
        TagCount.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
    }
    TagCount.model = model
    return TagCount
}
