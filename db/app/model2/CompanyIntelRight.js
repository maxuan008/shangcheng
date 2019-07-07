module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    companyIntelRight_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
        
        company_id: INTEGER(11),
        year: INTEGER,  //年份
        proprietary: INTEGER(11), //自主知识产权
        invention: INTEGER(11), //发明专利
        utility: INTEGER(11),  //实用专利
        appearance: INTEGER(11), //外观专利
        PCT: INTEGER(11),
        trademark: INTEGER(11), //商标
        copyright: INTEGER(11),  //著作权
        ic: INTEGER(11),    //集成电路
        software: INTEGER(11), //软件产品
  
        explanationIndustryUniversity: TEXT, //产学研合作说明：
        isExplanationUniversity: INTEGER(3), //是否与国内外研究开发机构开展多种形式产学研合作："1是 0否"
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const CompanyIntelRight = app.devSeq.DevMysqlSeq.define('companyIntelRight', model, {
    paranoid: true
  })
  CompanyIntelRight.associate = function() {
    CompanyIntelRight.belongsTo(app.devModel.Company,{foreignKey:'company_id'})
    // companyQualification.hasMany(app.devModel.User,{foreignKey: 'park_id'})
  
}
CompanyIntelRight.model = model
  return CompanyIntelRight
}