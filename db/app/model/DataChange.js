module.exports = app => {
    const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

    const model = {

        dataChange_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },
        table: STRING(80), //表名
        field: STRING(50), //字段名

        source_id: INTEGER(11), //源ID
        dictionary: STRING(300), //字典
        log_id: STRING(80),
        data: STRING(2000), //数据
        oldData: STRING(2000), //旧数据
        flag: { type: INTEGER(2), defaultValue: 1 }, //1:待确认， 2:已确认， 3.未通过

        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

    }

    const DataChange = app.model.define('dataChange', model, {
        paranoid: true
    })
    DataChange.associate = function () {
    }
    DataChange.model = model
    return DataChange
}