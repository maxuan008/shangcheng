module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    talent_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      
      park_id:INTEGER(11),
      company_id: INTEGER(11),
      serverOrg_id:  INTEGER(11),
      
      photo: STRING(100),  //照片
      name: STRING(100),  //人才姓名
      tags: STRING(200),  //人才标签
      sex: INTEGER(2),    //性别
      birthDate: DATEONLY,  //生日
      education: STRING(50),  //学历
      graduateSchool: STRING(200),  //毕业学校
      position: STRING(50),  //职位
      workExperience: STRING(2000),       //工作经历
      introduction: STRING(1000),       //工作介绍
      
      isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
      createdAt: DATE,
      updatedAt: DATE,
      deletedAt: DATE

  }

  const Talent = app.devSeq.DevMysqlSeq.define('talent', model, {
    paranoid: true
  })
  Talent.associate = function() {
    Talent.belongsTo(app.devModel.Company,{foreignKey:'company_id'})
    Talent.belongsTo(app.devModel.Park,{foreignKey:'park_id'})
    Talent.belongsTo(app.devModel.ServerOrg,{foreignKey:'serverOrg_id'})
    Talent.belongsToMany(app.devModel.ConfTalentPlan,{through:'talentConfPlan',foreignKey:'talent_id'})
    // companyFinancing.hasMany(app.devModel.User,{foreignKey: 'park_id'})
  
}
Talent.model = model
  return Talent
}