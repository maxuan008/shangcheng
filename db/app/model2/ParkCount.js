module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING ,BIGINT} = app.Sequelize

  const model = {

    parkCount_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
        
        park_id:INTEGER(11),
        year: INTEGER,  //年份
  
        // 经营信息 -------------------------------------
        yearlyIncoming: BIGINT, // 本年度总收入
        yearlyRDFund: BIGINT, // 年度研究与试验发展经费
        taxPayed: BIGINT, // 实际上缴税费
  
        //数量统计
        companyCount: INTEGER(11),  //企业数量
        hatchCount: INTEGER(11),   //在孵数量
  
  
        // 国家政策支持 -------------------------------------
        nationalRDProject: INTEGER, // 承担国家科研和产业化项目（项）
        nationalRDFinancing: BIGINT, // 承担国家科研和产业化获得资助（元）
        ProvinceRDProject: INTEGER, // 承担省市区科研开发项目（项）
        ProvinceRDFinancing: BIGINT, // 承担省市区科研开发项目获得资助金额（元）
  
        //人员层次统计
        rd: INTEGER, // 研发人员
        science: INTEGER, // 科技活动人员
        doctor: INTEGER, // 博士人数
        master: INTEGER, // 硕士人数
        postgraduate: INTEGER, // 研究生人数
        bachelor: INTEGER, // 本科生人数
        overseas: INTEGER, // 留学人数
        college: INTEGER, // 大专生人数
        secondary: INTEGER, // 中专生人数
        internship: INTEGER, // 接纳大学生、研究生实习人员
        freshGraduate: INTEGER, // 接纳应届毕业生就业人员
  
      
        //知识产权分布
        proprietary: INTEGER(11), //自主知识产权
        invention: INTEGER(11), //发明专利
        utility: INTEGER(11),  //实用专利
        appearance: INTEGER(11), //外观专利
        PCT: INTEGER(11),
        trademark: INTEGER(11), //商标
        copyright: INTEGER(11),  //著作权
        ic: INTEGER(11),    //集成电路
        software: INTEGER(11), //软件产品
        total:INTEGER(11),
    
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const ParkCount = app.devSeq.DevMysqlSeq.define('parkCount', model, {
    paranoid: true
  })
  ParkCount.associate = function() {
    ParkCount.belongsTo(app.devModel.Park,{foreignKey:'park_id'})
    ParkCount.hasMany(app.devModel.ParkCountCompanyClass,{foreignKey:'parkCount_id'})
    ParkCount.hasMany(app.devModel.ParkCountQualification,{foreignKey:'parkCount_id'})
    ParkCount.hasMany(app.devModel.ParkCountServerClass,{foreignKey:'parkCount_id'})
    ParkCount.hasMany(app.devModel.ParkCountTalentPlan,{foreignKey:'parkCount_id'})
    // Park.belongsToMany(app.devModel.Area,{through: 'areaPark',foreignKey: 'park_id'})
    // Park.hasMany(app.devModel.User,{foreignKey: 'park_id'})
    // Park.hasMany(app.devModel.ConfTag,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfSetParkAddress,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfParkAddress,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfTalentPlan,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfIndustryConcern,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfQualification,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfStateOccupancy,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfCompanyInfoType,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfServerClass,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfServerType,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfJoinWork,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.ConfCompanyClass,{foreignKey:'park_id'})
    // Park.hasMany(app.devModel.Talent,{foreignKey:'park_id'})
}
ParkCount.model = model
  return ParkCount
}