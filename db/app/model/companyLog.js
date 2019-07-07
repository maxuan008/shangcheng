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
    companyLog_id: {    
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    
    company_id:INTEGER(11),
    url:  STRING(150), //
    params :  STRING(500),   //

    source_id:INTEGER(11),   //原ID
    module: STRING(50),      //模块
    flag:  INTEGER(2),       //1:添加  2.修改  3.删除, 4.网络数据确认, 5.企业填报审核  6.初始化数据+
    field:  TEXT,            //字段修改项：  ['adress' ]
    //新增
    user_id:INTEGER(11),     //操作人 ： -1：系统
    user_name:  STRING(35),  //操作人姓名
    user_tel: STRING(30),    //操作人联系电话

    datas:TEXT, //
    year: INTEGER(11),
    isValid: {type:INTEGER(2) , defaultValue: 1  },       //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE
  }

  const CompanyLog = app.model.define('companyLog', model, {
      paranoid: true
  })
  CompanyLog.associate = function() {
    CompanyLog.belongsTo(app.pgModel.Company,{foreignKey:'company_id'})
      // CompanyStore.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
      // companyStore.hasMany(app.pgModel.OperationPermission)
  }
  CompanyLog.model = model
  return CompanyLog
}
