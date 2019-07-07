module.exports = app => {
  const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING, BIGINT } = app.Sequelize

  const model = {

    company_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },

    park_id: INTEGER(11),
    confStateOccupancy_id: INTEGER(11), //入住状态\
    hatchStatus: { type: INTEGER(2), defaultValue: 2 }, //在孵状态 1:在孵 0：未在孵
    confCompanyClass_id: INTEGER(11),    //企业类别

    name: STRING(100), //企业名称
    business: STRING(2000), //主营业务
    entryTime: DATEONLY, //入园日期
    contact: STRING(50), //联系人
    contactNumber: STRING(20), //联系人
    teamSize: INTEGER(8), //团队规模
    address: STRING(200), //企业地址
    remark: STRING(1000), //备注信息


    prjName: STRING(100), //服务项目
    startJoinDate: DATEONLY, //合作开始时间
    contact: STRING(100), //联系人
    logo: STRING(50),
    contactNumber: STRING(20), //联系电话


    socialCreditCode: STRING(30),  //统一社会信用代码
    registeredCapital: BIGINT(30), //注册资本

    legalRepresentative: STRING(30), //法定代表人
    establishmentDate: DATEONLY, //成立日期
    approvalDate: DATEONLY, //核准日期

    operationStatus: INTEGER(11),         //1开业，2存续， 3吊销， 4注销
    operationTermStart: DATEONLY,       //营业期限开始时间
    operationTermEnd: DATEONLY,         //营业期限截止时间
    registerInstitution: STRING(100),   //登记机关
    operationRange: STRING(2000),       //经营范围
    registrationAddress: STRING(200),  //注册地址
    companyType: STRING(200),  //公司类型


    changeFlag: INTEGER(2),         //1改变 , 0未改变
    changTime: DATE,      //最近更新时间
    isCountIntelRight: {type:INTEGER(2) , defaultValue: 0  } ,  //是否在孵 1:已统计 0：未统计

    isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const Company = app.devSeq.DevMysqlSeq.define('company', model, {
    paranoid: true
  })
  Company.associate = function () {
    Company.belongsTo(app.devModel.ConfStateOccupancy, { foreignKey: 'confStateOccupancy_id' })
    Company.belongsTo(app.devModel.ConfCompanyClass, { foreignKey: 'confCompanyClass_id' })
    Company.belongsToMany(app.devModel.ConfTag, { through: 'companyConfTag', foreignKey: 'company_id' })
    Company.belongsToMany(app.devModel.ConfQualification, { through: 'companyQualification', foreignKey: 'company_id' })
    Company.belongsToMany(app.devModel.ConfCompanyInfoType, { through: 'companyFiles', foreignKey: 'company_id' })
    Company.hasMany(app.devModel.CompanyEmployees, { foreignKey: 'company_id' })
    Company.hasMany(app.devModel.CompanyShareholders, { foreignKey: 'company_id' })
    Company.hasMany(app.devModel.CompanyIntelRight, { foreignKey: 'company_id' })
    Company.hasMany(app.devModel.CompanyNeed, { foreignKey: 'company_id' })
    Company.hasMany(app.devModel.CompanyOperation, { foreignKey: 'company_id' })
    Company.hasMany(app.devModel.CompanyPatent, { foreignKey: 'company_id' })
    Company.hasMany(app.devModel.CompanyNews, { foreignKey: 'company_id' })
    Company.hasMany(app.devModel.CompanyFinancing, { foreignKey: 'company_id' })
    Company.hasMany(app.devModel.Talent, { foreignKey: 'company_id' })
    Company.hasMany(app.devModel.CompanyTalentStat, { foreignKey: 'company_id' })
    Company.belongsTo(app.devModel.Park, { foreignKey: 'park_id' })
    Company.hasMany(app.devModel.CompanyFiles, { foreignKey: 'company_id', as: 'files' })
    //  Company.belongsTo(app.devModel.ConfCompanyInfoType,{foreignKey:''})
    // Company.hasMany(app.devModel.User,{foreignKey: 'park_id'})confCompanyInfoType

  }
  Company.model = model
  return Company
}