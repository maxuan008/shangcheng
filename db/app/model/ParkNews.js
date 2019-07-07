let {upsertTag}=require('../../utils/utils')
module.exports = app => {
  const { TINYINT, JSON, BOOLEAN, TEXT, INTEGER, DATE, DATEONLY, ARRAY, DECIMAL, STRING } = app.Sequelize

  const model = {
    parkNews_id: {
      type: INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },

    park_id: INTEGER(11),
    title: STRING(200), //标题 
    details: TEXT,   //新闻正本
    tags: STRING(800),  //标签
    issueDate: DATE,  //发布日期
    url: STRING(800),  //标签
    issueStatus: { type: INTEGER(2), defaultValue: 0 }, //是否发布 -1取消， 0待审核，1审核通过
    auditingStatus: { type: INTEGER(2), defaultValue: 1 }, //超管审核 0待审核，1审核通过 ， 2审核未通过
    simhash1: STRING(16),
    simhash2: STRING(16),
    simhash3: STRING(16),
    simhash4: STRING(16),
    summary: STRING(500),
    isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE
    // parkNews_id: {
    //   type: INTEGER(11),
    //   primaryKey: true,
    //   autoIncrement: true,
    // },

    // title: STRING(200), // 标题
    // content: TEXT, // 内容
    // type: INTEGER, // 类型
    // source : STRING(50), // 来源
    // spiderSource : STRING(50), // 爬虫来源
    // sourceWebsite : STRING(500), // 来源网站
    // tag: JSON, // 标签
    // releasedAt: DATEONLY, // 发表时间
    // park_id:INTEGER,

    // isValid: {type:INTEGER(2) , defaultValue: 1  }, //是否有效
    // createdAt: DATE,
    // updatedAt: DATE,
    // deletedAt: DATE

  }

  const ParkNews = app.model.define('parkNews', model, {
    paranoid: true,
    hooks:{
      afterCreate:async (instance,options)=>{
        let {dataValues}=instance
        let curTags=dataValues.tags
        let {park_id}=dataValues
        let {TagCount}=app.pgModel
        const flag=2
        console.log(dataValues)
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
				const flag = 2
				
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
  ParkNews.model = model
  return ParkNews
}