module.exports = app => {
    const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

    const model = {

        productTalent_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },

        product_id: INTEGER(11),
        talent_id: INTEGER(11),

        flag: INTEGER(2), //1:团队成员  2.导师 

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

    }

    const ProductTalent = app.model.define('productTalent', model, {
        paranoid: true
    })
    ProductTalent.associate = function () {
        ProductTalent.belongsTo(app.pgModel.Product, { foreignKey: 'product_id' })
        // ProductTalent.belongsToMany(app.pgModel.TalentConfPlan, {through: 'talent', foreignKey: 'talent_id' })
        ProductTalent.belongsTo(app.pgModel.Talent, { foreignKey: 'talent_id' })
    }
    ProductTalent.model = model
    return ProductTalent
}