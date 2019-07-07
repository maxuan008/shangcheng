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
    } = app.Sequelize;

    const model = {
        policyCompanyPark_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        policy_id: INTEGER(11),
        park_id: INTEGER(11),
        company_id: INTEGER(11),
        issueStatus: { type: INTEGER(2), defaultValue: 1 }, //是否发布 -1取消， 0待审核，1审核通过
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    };

    const PolicyCompanyPark = app.model.define('policyCompanyPark', model, {
        paranoid: true
    });
    PolicyCompanyPark.associate = function() {
        PolicyCompanyPark.belongsTo(app.pgModel.Policy, { foreignKey: 'policy_id' });
        PolicyCompanyPark.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' });
        PolicyCompanyPark.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' });
        // policyCompanyPark.hasMany(app.pgModel.OperationPermission)
    };
    PolicyCompanyPark.model = model;
    return PolicyCompanyPark;
};
