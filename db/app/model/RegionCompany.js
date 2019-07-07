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
        regionCompany_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        region_id: INTEGER(11),
        company_id: INTEGER(11),

        // lib: INTEGER(2), //所在库：1.在孵企业库、2.在孵团队库、3.离园企业库、4.毕业企业库
        entryTime: DATEONLY, //入园日期
        confStateOccupancy_id: INTEGER(11), //入住状态
        address: STRING(200), //企业地址
        floorSpace: FLOAT, //占用场地面积 （平方米）
        safetyResponsiblePerson: STRING(100), // 安全责任人
        responsiblePersonContactNumber: STRING(20), //责任人联系电话
        contacts: TEXT,  //联系人集合
        isValid: { type: INTEGER(2), defaultValue: 1 },       //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const RegionCompany = app.model.define('regionCompany', model, {
        paranoid: true
    })
    RegionCompany.associate = function () {
        // Region.hasMany(app.pgModel.PolicyCompanyPark, { foreignKey: 'region_id' })
        RegionCompany.hasMany(app.pgModel.RegionHatchStatus, { foreignKey: 'regionCompany_id' })
        RegionCompany.hasMany(app.pgModel.RegionContact, { foreignKey: 'regionCompany_id' })
        RegionCompany.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
        RegionCompany.belongsTo(app.pgModel.Region, { foreignKey: 'region_id' })
        RegionCompany.belongsTo(app.pgModel.ConfStateOccupancy,{foreignKey:'confStateOccupancy_id'})
    }
    RegionCompany.model = model
    return RegionCompany
}
