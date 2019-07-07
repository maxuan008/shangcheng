module.exports = app => {
    const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING, BIGINT } = app.Sequelize
  
    const model = {
  
        industryNewsPark_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
          },
    
          industryNews_id: INTEGER(11),
          park_id: INTEGER(11),
    
          isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
          createdAt: DATE,
          updatedAt: DATE,
          deletedAt: DATE
  
    }
  
    const IndustryNewsPark = app.devSeq.DevMysqlSeq.define('industryNewsPark', model, {
      paranoid: true
    })
    IndustryNewsPark.associate = function () {
        IndustryNewsPark.belongsTo(app.devModel.IndustryNews,{foreignKey:'industryNews_id'})
        IndustryNewsPark.belongsTo(app.devModel.Park,{foreignKey:'park_id'})
      //  industryNewsPark.belongsTo(app.devModel.ConfCompanyInfoType,{foreignKey:''})
      // industryNewsPark.hasMany(app.devModel.User,{foreignKey: 'park_id'})confCompanyInfoType
  
    }
    IndustryNewsPark.model = model
    return IndustryNewsPark
  }