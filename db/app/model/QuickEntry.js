module.exports = app => {
    const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING, BIGINT } = app.Sequelize
  
    const model = {
  
        quickEntry_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
         },
          park_id: INTEGER(11),
          P_id:   INTEGER(11),
          user_id:INTEGER(11),
          isSelected: {type:INTEGER(2) , defaultValue: 0}, //0未选择， 1选择
    
          isValid: {type:INTEGER(2) , defaultValue: 1}, //是否有效
          createdAt: DATE,
          updatedAt: DATE,
          deletedAt: DATE
  
    }
  
    const QuickEntry = app.model.define('quickEntry', model, {
      paranoid: true
    })
    QuickEntry.associate = function () {
        QuickEntry.belongsTo(app.pgModel.Permission,{foreignKey:'P_id'})
        QuickEntry.belongsTo(app.pgModel.Park,{foreignKey:'park_id'})
        // QuickEntry.belongsTo(app.pgModel.IndustryNews,{foreignKey:'industryNews_id'})
        // QuickEntry.belongsTo(app.pgModel.Park,{foreignKey:'park_id'})
      //  QuickEntry.belongsTo(app.pgModel.ConfCompanyInfoType,{foreignKey:''})
      // QuickEntry.hasMany(app.pgModel.User,{foreignKey: 'park_id'})confCompanyInfoType
  
    }
    QuickEntry.model = model
    return QuickEntry
  }