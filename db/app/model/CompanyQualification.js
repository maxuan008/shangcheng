module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    companyQualification_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
        
        company_id:INTEGER(11),
        confQualification_id: INTEGER(11),
        //name: STRING(100), //服务资质名称
        url: STRING(200),      //文件地址
    
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const CompanyQualification = app.model.define('companyQualification', model, {
    paranoid: true,
    hooks:{
      afterCreate:async (instance, options)=>{
        console.log('afterCreate',instance)
        let {Company,ConfQualification}=app.pgModel
        let {company_id,isValid,confQualification_id}=instance.dataValues
        let {name}=await ConfQualification.findOne({
          where:{
            isValid:1,
            confQualification_id
          },
          raw:true,
          attributes:['name']
        })
        if(isValid===1&&name==='高新企业'){
          await Company.update({
            isHeightCompany:1
          },{
              where:{
                isValid:1,
                company_id
              }
          })
        }
      },
      afterUpdate:async (instance,options)=>{
        let {Company,ConfQualification}=app.pgModel
        let {company_id,isValid,confQualification_id}=instance.dataValues
        let {name}=await ConfQualification.findOne({
          where:{
            isValid:1,
            confQualification_id
          },
          raw:true,
          attributes:['name']
        })
        if(isValid===0&&name==='高新企业'){
          await Company.update({
            isHeightCompany:2
          },{
              where:{
                isValid:1,
                company_id
              }
          })
        }
        // console.log('afterUpdate',instance)
      }
    }
  })

  CompanyQualification.associate = function() {
    // companyQualification.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
    CompanyQualification.belongsTo(app.pgModel.Company,{foreignKey:'company_id'})
    CompanyQualification.belongsTo(app.pgModel.ConfQualification,{foreignKey:'confQualification_id'})
}
CompanyQualification.model = model
  return CompanyQualification
}