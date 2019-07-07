module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {
    parkNews_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
     },

      park_id:INTEGER(11),
      title: STRING(200), //标题 
      details:TEXT,   //新闻正本
      tags: STRING(800),  //标签
      issueDate: DATE,  //发布日期
      url: STRING(800),  //标签
      issueStatus : {type:INTEGER(2) , defaultValue: 0  }, //是否发布 -1取消， 0待审核，1审核通过
      auditingStatus: {type:INTEGER(2) , defaultValue: 1  }, //超管审核 0待审核，1审核通过 ， 2审核未通过
      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE
    // parkNews_id: {
    //   type: INTEGER(11),
    //   primaryKey: true,
    //   autoIncrement: true,
    // },

    // title: STRING(200), // 标题
    // content: TEXT, // 内容
    // type: INTEGER, // 类型
    // source : STRING(50), // 来源
    // spiderSource : STRING(50), // 爬虫来源
    // sourceWebsite : STRING(500), // 来源网站
    // tag: JSON, // 标签
    // releasedAt: DATEONLY, // 发表时间
    // park_id:INTEGER,
   
    // isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
    // createdAt: DATE,
    // updatedAt: DATE,
    // deletedAt: DATE

  }

  const ParkNews = app.devSeq.DevMysqlSeq.define('parkNews', model, {
    paranoid: true
  })
  ParkNews.model = model
  return ParkNews
}