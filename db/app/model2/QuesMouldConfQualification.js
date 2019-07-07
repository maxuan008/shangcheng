module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    quesMouldConfQualification_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },

    quesMould_id: INTEGER(11),
    confQualification_id:   INTEGER(11), //企业资质配置

    isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const QuesMouldConfQualification = app.devSeq.DevMysqlSeq.define('quesMouldConfQualification', model, {
    paranoid: true
  })
  QuesMouldConfQualification.associate = function() {
    QuesMouldConfQualification.belongsTo(app.devModel.QuesMould,{foreignKey:'quesMould_id'})
    QuesMouldConfQualification.belongsTo(app.devModel.ConfQualification,{foreignKey:'confQualification_id'})
    // companyQualification.hasMany(app.devModel.User,{foreignKey: 'park_id'})
  
}
QuesMouldConfQualification.model = model
  return QuesMouldConfQualification
}