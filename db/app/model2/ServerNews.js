module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY,BIGINT, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    serverNews_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
  
        serverOrg_id:INTEGER(11),
        title: STRING(200), //标题
        details:TEXT,   //新闻正本
        companyName:  STRING(800),  //公司名
        tags: STRING(800),  //标签
        issueDate: DATEONLY,  //发布日期
        
    
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const ServerNews = app.devSeq.DevMysqlSeq.define('serverNews', model, {
    paranoid: true
  })
  ServerNews.associate = function() {
   
    ServerNews.belongsTo(app.devModel.ServerOrg,{foreignKey:'serverOrg_id'})
}
ServerNews.model = model
  return ServerNews
}