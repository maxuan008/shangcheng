let {upsertTag}=require('../../utils/utils')
module.exports=app=>{
    const {TINYINT,JSON,BOOLEAN,  TEXT ,INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {

    companyNews_id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
       },
  
        company_id:INTEGER(11),
        title: STRING(200), //标题
        details:TEXT,   //新闻正本
        companyName:  STRING(800),  //公司名
        tags: STRING(800),  //标签
        issueDate: DATE,  //发布日期
        url:STRING(800),
        issueStatus : {type:INTEGER(2) , defaultValue: 0 }, //是否发布 1表示发布
        auditingStatus: {type:INTEGER(2) , defaultValue: 1  }, //超管审核 0待审核，1审核通过 ， 2审核未通过
        simhash1:STRING(16),
        simhash2:STRING(16),
        simhash3:STRING(16),
        simhash4:STRING(16),
        summary:STRING(500),
        isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE

  }

  const CompanyNews = app.model.define('companyNews', model, {
    paranoid: true,
    hooks:{
      afterCreate:async (instance,options)=>{
        let {dataValues}=instance
        let curTags=dataValues.tags
        let {company_id}=dataValues
        if(!company_id){
          return
        }
        let {TagCount,Company}=app.pgModel
        let company=await Company.findOne({
          where:{
            isValid:1,
            company_id
          },
          attributes:['park_id']
        })
        if(!company){
          return
        }
        let {park_id}=company
        const flag=1
        if(dataValues.issueStatus===1&&dataValues.auditingStatus===1){
          await upsertTag({
            tags:curTags,
            park_id,
            flag,
            TagCount,
            addOrUpdate: 1
        })
        }
      },
			afterUpdate:async (instance,options)=>{
				/**
				 * _previousDataValues数据库中的数据
				 * dataValues 要修改成的数据
				 */
				let {_previousDataValues,dataValues}=instance
				let {TagCount,Company}=app.pgModel
				/**
				 * 前端已发布 超管已审核
				 */
				console.log('instance',instance)
				if(_previousDataValues.isValid!==1){
					return
				}
				let prevTags=_previousDataValues.tags
				let curTags=dataValues.tags
        let company=await Company.findOne({
          where:{
            isValid:1,
            company_id:_previousDataValues.company_id
          },
          attributes:['park_id']
        })
        if(!company){
          return
        }
        let {park_id}=company
				const flag = 1
				
				if(dataValues.isValid===1){
					console.log('存在')
					console.log('_previousDataValues',_previousDataValues)
					console.log('dataValues',dataValues)
					if(_previousDataValues.issueStatus===1&&_previousDataValues.auditingStatus===1){
						if(!(dataValues.issueStatus===1&&dataValues.auditingStatus===1)){
							//取消
							await upsertTag({
                tags:prevTags,
                park_id,
                flag,
                TagCount,
                addOrUpdate: 0
            })
						}else{
							//修改
							await upsertTag({
                tags:prevTags,
                park_id,
                flag,
                TagCount,
                addOrUpdate: 0
							})
							await upsertTag({
                tags:curTags,
                park_id,
                flag,
                TagCount,
                addOrUpdate: 1
            })
						}
					}else{
						//新增
						if(dataValues.issueStatus===1&&dataValues.auditingStatus===1){
              console.log('新增')
							await upsertTag({
                tags:curTags,
                park_id,
                flag,
                TagCount,
                addOrUpdate: 1
            })
						}
					}
				}else if(dataValues.isValid!==1){
					//删除
					if(_previousDataValues.issueStatus===1&&_previousDataValues.auditingStatus===1){
						await upsertTag({
							tags:prevTags,
							park_id,
							flag,
							TagCount,
							addOrUpdate: 0
					})
					}
				}
				
			}
		}
  })
  CompanyNews.associate = function() {
    CompanyNews.belongsTo(app.pgModel.Company,{foreignKey:'company_id'})
    // companyNews.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
  
}
CompanyNews.model = model
  return CompanyNews
}