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
		companyIntelRight_id: {
			type: INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},

		company_id: INTEGER(11),
		year: INTEGER, //年份
		proprietary: INTEGER(11), //自主知识产权
		invention: INTEGER(11), //发明专利
		utility: INTEGER(11), //实用新型专利 改为授权实用新型专利
		appearance: INTEGER(11), //外观专利 改为授权实用外观专利
		PCT: INTEGER(11),
		trademark: INTEGER(11), //商标 改为知识产权授权数-->商标
		copyright: INTEGER(11), //著作权授权数
		worksCopyright: INTEGER(11), //其中作品著作权授权数
		softwareCopy: INTEGER(11), //其中软件著作权授权数
		ic: INTEGER(11), //集成电路
		software: INTEGER(11), //软件产品

		//新增字段
		patentAppNum: INTEGER(11), // 专利申请数
		inventionPatentApp: INTEGER(11), //  其中：发明专利
		patentsAuthorizationNum: INTEGER(11), //  专利授权数
		inventionPatentAuthorizationNum: INTEGER(11), //  其中：发明专利
		buyForeignPatentNum: INTEGER(11), //  购买国外技术专利
		availableIntellectualNum: INTEGER(11), //  拥有有效知识产权数
		intellectualPatentNum: INTEGER(11), // 其中：发明专利
		intellectualSoftware: INTEGER(11), //  软件著作权
		intellectualNewVarietyPlant: INTEGER(11), //  植物新品种
		intellectualIC: INTEGER(11), //  集成电路布图
		technicalContractNum: INTEGER(11), //  技术合同交易数量
		technicalContractToal: BIGINT(20), //   技术合同交易额
		provincialAwards: INTEGER(11), //   当年获得省级以上奖励

		intellectualApplyNum: INTEGER(11), //   知识产权申请数
		intellectualAuthorizationNum: INTEGER(11), // 知识产权授权数

		//-其中：国防专利数量：
		nationalPatent: INTEGER(11),
		nationalCropVariety: INTEGER(11), //国家级农作物品种数量：
		nationalNewDrug: INTEGER(11), //国家新药数量：
		nationalFirstclassProtection: INTEGER(11), //国家一级中药保护品种数量：
		designExclusiveRight: INTEGER(11), //设计专有权数量
		isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效

		explanationIndustryUniversity: TEXT, //产学研合作说明：
		isExplanationUniversity: INTEGER(3), //是否与国内外研究开发机构开展多种形式产学研合作："1是 0否"
		month: INTEGER, //月份
		createdAt: DATE,
		updatedAt: DATE,
		deletedAt: DATE,
		fieldOfTechnology: STRING(20)
	}

	const CompanyIntelRight = app.model.define('companyIntelRight', model, {
		paranoid: true
	})
	CompanyIntelRight.associate = function() {
		CompanyIntelRight.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
		// companyQualification.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
	}
	CompanyIntelRight.model = model
	return CompanyIntelRight
}
