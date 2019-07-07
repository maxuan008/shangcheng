module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY,BIGINT, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    serverSuccessfulCase_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
  
        serverOrg_id:INTEGER(11),
        title: STRING(200), //标题
        prjName:  STRING(200), //服务项目
        companyName:  STRING(800),  //合作企业
        advantage:  STRING(800),  //服务优势
        details:TEXT,   //案例详情 
  
        image: STRING(200),      //文件地址
    
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const ServerSuccessfulCase = app.devSeq.DevMysqlSeq.define('serverSuccessfulCase', model, {
    paranoid: true
  })
  ServerSuccessfulCase.associate = function() {
   
    ServerSuccessfulCase.belongsTo(app.devModel.ServerOrg,{foreignKey:'serverOrg_id'})
}
ServerSuccessfulCase.model = model
  return ServerSuccessfulCase
}