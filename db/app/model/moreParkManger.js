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
        moreParkManger_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        user_id: INTEGER(11),
        park_id: INTEGER(11),
        role_id: INTEGER(11),
        identityStatus: { type: INTEGER(2), allowNull: false, defaultValue: 2 }, //0：超管 ， 1：园区管理员 ， 2：普通用户
        isDefault: { type: INTEGER(2), defaultValue: 0 }, //是否默认：0否 ，1默认
        isCheck: INTEGER(2),
        isTopRegion:{type: INTEGER(3) , allowNull:false, defaultValue: 0 }, //是否是总区域，1在孵企业 2在孵团队 3=[1,2]
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const MoreParkManger = app.model.define('moreParkManger', model, {
        paranoid: true
    })
    MoreParkManger.associate = function() {
        MoreParkManger.belongsTo(app.pgModel.User, { foreignKey: 'user_id' })
        MoreParkManger.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
        MoreParkManger.belongsTo(app.pgModel.Role, { foreignKey: 'role_id' })
        // moreParkManger.hasMany(app.pgModel.OperationPermission)
    }
    MoreParkManger.model = model
    return MoreParkManger
}
