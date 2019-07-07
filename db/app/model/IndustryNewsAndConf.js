module.exports = app => {
    const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING, BIGINT } = app.Sequelize
  
    const model = {
  
        industryNewsAndConf_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
          },
    
          industryNews_id: INTEGER(11),
          confIndustryConcern_id: INTEGER(11),
    
          isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
          createdAt: DATE,
          updatedAt: DATE,
          deletedAt: DATE
  
    }
  
    const IndustryNewsAndConf = app.model.define('industryNewsAndConf', model, {
      paranoid: true
    })
    IndustryNewsAndConf.associate = function () {
        IndustryNewsAndConf.belongsTo(app.pgModel.IndustryNews,{foreignKey:'industryNews_id'})
        IndustryNewsAndConf.belongsTo(app.pgModel.ConfIndustryConcern,{foreignKey:'industryNews_id'})
      //  industryNewsAndConf.belongsTo(app.pgModel.ConfCompanyInfoType,{foreignKey:''})
      // industryNewsAndConf.hasMany(app.pgModel.User,{foreignKey: 'park_id'})confCompanyInfoType
  
    }
    IndustryNewsAndConf.model = model
    return IndustryNewsAndConf
  }