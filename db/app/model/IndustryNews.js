let {upsertTag}=require('../../utils/utils')
module.exports = app => {
	const {
		TINYINT,
		JSON,
		BOOLEAN,
		TEXT,
		INTEGER,
		DATE,
		DATEONLY,
		ARRAY,
		DECIMAL,
		STRING,
		BIGINT
	} = app.Sequelize

	const model = {
		industryNews_id: {
			type: INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},

		park_id: INTEGER(11),

		//标题
		title: STRING(200),

		//发布人
		issuer: STRING(100),

		//新闻正本
		details: TEXT,

		//发布日期
		issueDate: DATE,

		//标签
		url: STRING(800),

		/**行业新闻没有issueStatus*/
		//是否发布 -1取消， 0待审核，1审核通过
		issueStatus: { type: INTEGER(2), defaultValue: 1 },

		//超管审核 0待审核，1审核通过 ， 2审核未通过
		auditingStatus: { type: INTEGER(2), defaultValue: 0 },

		//标签
		tags: STRING(800),

		simhash1: STRING(16),
		simhash2: STRING(16),
		simhash3: STRING(16),
		simhash4: STRING(16),
		summary: STRING(500),

		//是否有效
		isValid: { type: INTEGER(2), defaultValue: 1 },

		createdAt: DATE,
		updatedAt: DATE,
		deletedAt: DATE,
		hash_id: STRING(32)
	}

	const IndustryNews = app.model.define('industryNews', model, {
		paranoid: true,
		hooks:{
			afterUpdate:async (instance,options)=>{
				/**
				 * _previousDataValues数据库中的数据
				 * dataValues 要修改成的数据
				 */
				let {_previousDataValues,dataValues}=instance
				let {TagCount}=app.pgModel
				/**
				 * 前端已发布 超管已审核
				 */
				console.log('instance',instance)
				if(_previousDataValues.isValid!==1){
					return
				}
				let prevTags=_previousDataValues.tags
				let curTags=dataValues.tags
				let {park_id}=_previousDataValues
				const flag = 3
				
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
	IndustryNews.associate = function() {
		IndustryNews.hasMany(app.pgModel.IndustryNewsAndConf, { foreignKey: 'industryNews_id' })
		IndustryNews.hasMany(app.pgModel.IndustryNewsPark, { foreignKey: 'industryNews_id' })
		//  industryNews.belongsTo(app.pgModel.ConfCompanyInfoType,{foreignKey:''})
		// industryNews.hasMany(app.pgModel.User,{foreignKey: 'park_id'})confCompanyInfoType
	}
	IndustryNews.model = model
	return IndustryNews
}
