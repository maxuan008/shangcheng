module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    policy_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
  
  
        title: STRING(200), //标题 
        issuer:STRING(100), //发布人
        details:TEXT,   //新闻正本
        issueDate: DATE,  //发布日期
        url: STRING(800),  //标签
        issueStatus : {type:INTEGER(2) , defaultValue: 0  }, //是否发布 -1取消， 0待审核，1审核通过
        auditingStatus: {type:INTEGER(2) , defaultValue: 0  }, //超管审核 0待审核，1审核通过 ， 2审核未通过
        tags: STRING(800),  //标签
        
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const Policy = app.devSeq.DevMysqlSeq.define('policy', model, {
    paranoid: true
  })
  Policy.associate = function() {
    Policy.hasMany(app.devModel.PolicyCompanyPark,{foreignKey:'policy_id'})
    // policy.hasMany(app.devModel.OperationPermission)
}
    Policy.model = model
  return Policy
}