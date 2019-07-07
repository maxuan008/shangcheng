module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    policyCompanyPark_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },

    policy_id: INTEGER(11),
    park_id:   INTEGER(11),
    company_id:INTEGER(11),

    isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE

  }

  const PolicyCompanyPark = app.devSeq.DevMysqlSeq.define('policyCompanyPark', model, {
    paranoid: true
  })
  PolicyCompanyPark.associate = function() {
    PolicyCompanyPark.belongsTo(app.devModel.Policy,{foreignKey:'policy_id'})
    PolicyCompanyPark.belongsTo(app.devModel.Park,{foreignKey:'park_id'})
    PolicyCompanyPark.belongsTo(app.devModel.Company,{foreignKey:'company_id'})
    // policyCompanyPark.hasMany(app.devModel.OperationPermission)
}
PolicyCompanyPark.model = model
  return PolicyCompanyPark
}