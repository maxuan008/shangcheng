module.exports = app => {
  const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, BIGINT, STRING } = app.Sequelize

  const model = {

    serverOrg_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },

    park_id: INTEGER(11),
    name: STRING(100), //服务机构名称
    confServerClass_id: INTEGER(11), //机构类别
    confServerType_id: INTEGER(11), //服务类型


    prjName: STRING(100), //服务项目
    startJoinDate: DATEONLY, //合作开始时间
    contact: STRING(100), //联系人
    logo: STRING(50),
    contactNumber: STRING(20), //联系电话
    address: STRING(200), //机构地址
    socialCreditCode: STRING(30),  //统一社会信用代码
    registeredCapital: BIGINT(30), //注册资本

    legalRepresentative: STRING(30), //法定代表人
    establishmentDate: DATEONLY, //establishmentDate
    approvalDate: DATEONLY, //核准日期

    operationStatus: INTEGER(11),         //1开业，2存续， 3吊销， 4注销
    operationTermStart: DATEONLY,       //营业期限开始时间
    operationTermEnd: DATEONLY,         //营业期限截止时间
    registerInstitution: STRING(100),   //登记机关
    operationRange: STRING(2000),       //经营范围
    registrationAddress: STRING(200),  //注册地址
    companyType: INTEGER(5),

    changeFlag: INTEGER(2), //1改变 , 0未改变
    changTime: DATE, //最近更新时间

    isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const ServerOrg = app.devSeq.DevMysqlSeq.define('serverOrg', model, {
    paranoid: true
  })
  ServerOrg.associate = function () {

    ServerOrg.belongsTo(app.devModel.Park, { foreignKey: 'park_id' })
    ServerOrg.belongsTo(app.devModel.ConfServerClass, { foreignKey: 'confServerClass_id' })
    ServerOrg.belongsTo(app.devModel.ConfServerType, { foreignKey: 'confServerType_id' })
    ServerOrg.belongsToMany(app.devModel.ConfJoinWork, { through: 'joinWorkServerOrg', foreignKey: 'serverOrg_id' })
    ServerOrg.hasMany(app.devModel.ServerShareholders, { foreignKey: 'serverOrg_id' })
    ServerOrg.hasMany(app.devModel.ServerEmployees, { foreignKey: 'serverOrg_id' })
    ServerOrg.hasMany(app.devModel.ServerQualification, { foreignKey: 'serverOrg_id' })
    ServerOrg.hasMany(app.devModel.ServerAgreement, { foreignKey: 'serverOrg_id' })
    ServerOrg.hasMany(app.devModel.ServerNews, { foreignKey: 'serverOrg_id' })
    ServerOrg.hasMany(app.devModel.ServerSuccessfulCase, { foreignKey: 'serverOrg_id' })
    ServerOrg.hasMany(app.devModel.Talent, { foreignKey: 'serverOrg_id' })
    // ServerOrg.hasMany(app.devModel.JoinWorkServerOrg)
  }
  ServerOrg.model = model
  return ServerOrg
}