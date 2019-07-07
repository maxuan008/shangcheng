/*
 * @Author: LeShine 
 * @Date: 2018-09-18 15:28:16 
 * @Last Modified by: LeShine
 * @Last Modified time: 2018-09-28 08:48:14
 */
module.exports = app => {
    const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize
    const model = {
        operationLog_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },

        park_id: INTEGER(11),
        url: STRING(150), //
        params: TEXT,//STRING(500), //
        source_id: INTEGER(11),  //原ID
        subject_id: INTEGER(11), //主体
        subject: STRING(50), //主体
        module: STRING(50), //模块
        field: STRING(50), //修改项
        flag: INTEGER(2), //1:添加  2.修改  3.删除, 4.网络数据确认, 5.企业填报审核  6.初始化数据

        oldData: STRING(500), //
        newData: STRING(500), //

        user_id: INTEGER(11), //操作人

        isValid: { type: INTEGER(2), defaultValue: 1 },       //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const OperationLog = app.model.define('operationLog',model,{
        paranoid: true
    })
    OperationLog.associate = function() {
        OperationLog.belongsTo(app.pgModel.User, { foreignKey: 'user_id' })
    }
    OperationLog.model = model
    return OperationLog

}