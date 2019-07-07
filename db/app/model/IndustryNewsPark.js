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
        BIGINT
    } = app.Sequelize;

    const model = {
        industryNewsPark_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        industryNews_id: INTEGER(11),
        park_id: INTEGER(11),
        auditingStatus: { type: INTEGER(2), defaultValue: 0 }, //超管审核 0待审核，1审核通过 ， 2审核未通过
        issueStatus: { type: INTEGER(2), defaultValue: 1 }, //是否发布 -1取消， 0待审核，1审核通过
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    };

    const IndustryNewsPark = app.model.define('industryNewsPark', model, {
        paranoid: true
    });
    IndustryNewsPark.associate = function() {
        IndustryNewsPark.belongsTo(app.pgModel.IndustryNews, { foreignKey: 'industryNews_id' });
        IndustryNewsPark.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' });
        //  industryNewsPark.belongsTo(app.pgModel.ConfCompanyInfoType,{foreignKey:''})
        // industryNewsPark.hasMany(app.pgModel.User,{foreignKey: 'park_id'})confCompanyInfoType
    };
    IndustryNewsPark.model = model;
    return IndustryNewsPark;
};
