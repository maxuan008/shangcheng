module.exports = app => {
    const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING, BIGINT } = app.Sequelize
  
    const model = {
  
        industryNews_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
          },
    
    
          title: STRING(200), //标题 
          issuer: STRING(100), //发布人
          details: TEXT,   //新闻正本
          issueDate: DATE,  //发布日期
          url: STRING(800),  //标签
          issueStatus: { type: INTEGER(2), defaultValue: 0 }, //是否发布 -1取消， 0待审核，1审核通过
          auditingStatus: {type:INTEGER(2) , defaultValue: 0  }, //超管审核 0待审核，1审核通过 ， 2审核未通过
          tags: STRING(800),  //标签
    
          isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
          createdAt: DATE,
          updatedAt: DATE,
          deletedAt: DATE
  
    }
  
    const IndustryNews = app.devSeq.DevMysqlSeq.define('industryNews', model, {
      paranoid: true
    })
    IndustryNews.associate = function () {
        IndustryNews.hasMany(app.devModel.IndustryNewsAndConf,{foreignKey:'industryNews_id'})
        IndustryNews.hasMany(app.devModel.IndustryNewsPark,{foreignKey:'industryNews_id'})
      //  industryNews.belongsTo(app.devModel.ConfCompanyInfoType,{foreignKey:''})
      // industryNews.hasMany(app.devModel.User,{foreignKey: 'park_id'})confCompanyInfoType
  
    }
    IndustryNews.model = model
    return IndustryNews
  }