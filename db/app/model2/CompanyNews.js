module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    companyNews_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
  
        company_id:INTEGER(11),
        title: STRING(200), //标题
        details:TEXT,   //新闻正本
        companyName:  STRING(800),  //公司名
        tags: STRING(800),  //标签
        issueDate: DATE,  //发布日期
        url:STRING(800),
        issueStatus : {type:INTEGER(2) , defaultValue: 0 }, //是否发布 1表示发布
        auditingStatus: {type:INTEGER(2) , defaultValue: 1  }, //超管审核 0待审核，1审核通过 ， 2审核未通过
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const CompanyNews = app.devSeq.DevMysqlSeq.define('companyNews', model, {
    paranoid: true
  })
  CompanyNews.associate = function() {
    CompanyNews.belongsTo(app.devModel.Company,{foreignKey:'company_id'})
    // companyNews.hasMany(app.devModel.User,{foreignKey: 'park_id'})
  
}
CompanyNews.model = model
  return CompanyNews
}