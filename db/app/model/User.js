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
        user_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        name: STRING(30), // 名字
        contactNumber: STRING(20), //联系电话
        password: STRING(128), // 密码 (sha256)
        salt: STRING(64), // 密码盐
        department: STRING(30), // 部门
        position: STRING(30), // 职位

        role_id: INTEGER(11), //角色
        park_id: INTEGER(11), //园区
        identityStatus: { type: INTEGER(2), allowNull: false, defaultValue: 2 }, //0：超管 ， 1：园区管理员 ， 2：普通用户
        isChangePass: { type: INTEGER(2), allowNull: false, defaultValue: 0 }, //0:未改过密码 1:改过密码
        
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const User = app.model.define('user', model, {
        paranoid: true
    })
    User.associate = function() {
        User.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
        User.belongsTo(app.pgModel.Role, { foreignKey: 'role_id' })
        User.hasMany(app.pgModel.MoreParkManger, { foreignKey: 'user_id' })
        // User.belongsToMany(app.pgModel.Park, { foreignKey: 'park_id', through: 'moreParkManger' })
        // Area.hasMany(app.pgModel.OperationPermission)
        User.hasMany(app.pgModel.OperationLog, { foreignKey: 'user_id' })
    }
    User.model = model
    return User
}
