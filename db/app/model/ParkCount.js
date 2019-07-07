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
		parkCount_id: {
			type: INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},

		park_id: INTEGER(11),

		//年份
		year: INTEGER,

		// 经营信息 -------------------------------------
		// 本年度总收入
		yearlyIncoming: BIGINT,

		// 年度研究与试验发展经费
		yearlyRDFund: BIGINT,

		// 实际上缴税费
		taxPayed: BIGINT,

		// 净利润
		netProfit: BIGINT,

		// 出口总额
		exportSum: BIGINT,

		//数量统计
		//企业数量
		companyCount: INTEGER(11),

		//在孵数量
		hatchCount: INTEGER(11),

		// 国家政策支持 -------------------------------------
		// 承担国家科研和产业化项目（项）
		nationalRDProject: INTEGER,

		// 承担国家科研和产业化获得资助（元）
		nationalRDFinancing: BIGINT,

		// 承担省市区科研开发项目（项）
		ProvinceRDProject: INTEGER,

		// 承担省市区科研开发项目获得资助金额（元）
		ProvinceRDFinancing: BIGINT,

		//人员层次统计
		// 研发人员
		rd: INTEGER,

		// 科技活动人员
		science: INTEGER,

		// 博士人数
		doctor: INTEGER,

		// 硕士人数
		master: INTEGER,

		// 研究生人数
		postgraduate: INTEGER,

		// 本科生人数
		bachelor: INTEGER,

		// 留学人数
		overseas: INTEGER,

		// 大专生人数
		college: INTEGER,

		// 中专生人数
		secondary: INTEGER,

		// 接纳大学生、研究生实习人员
		internship: INTEGER,

		// 接纳应届毕业生就业人员
		freshGraduate: INTEGER,

		//30及以下
		tech30: INTEGER,

		//31-40
		tech40: INTEGER,

		//41-50
		tech50: INTEGER,

		//51及以上
		tech60: INTEGER,

		//按来源
		// overseas: INTEGER, // 留学人数
		//外籍人员
		foreignPersonnel: INTEGER,

		// freshGraduate: INTEGER, // 接纳应届毕业生就业人员

		//知识产权分布
		//自主知识产权
		proprietary: INTEGER(11),

		//发明专利
		invention: INTEGER(11),

		//实用专利
		utility: INTEGER(11),

		//外观专利
		appearance: INTEGER(11),

		PCT: INTEGER(11),

		//商标
		trademark: INTEGER(11),

		//著作权
		copyright: INTEGER(11),

		//集成电路
		ic: INTEGER(11),

		//软件产品
		software: INTEGER(11),

		//软件著作权
		intellectualSoftware: INTEGER(11),

		//植物新品种
		intellectualNewVarietyPlant: INTEGER(11),

		//集成电路布图
		intellectualIC: INTEGER(11),

		total: INTEGER(11),


		//新增字段
		softwareCopy:INTEGER(11), //其中软件著作权
		worksCopyright:INTEGER(11),//其中作品著作权
		inventionPatentAuthorizationNum:INTEGER(11),//其中发明专利
		universityIncubator:INTEGER(11),//大学生创业
		highCompany:INTEGER(11),//高新技术企业（家）
		gazellesCompany:INTEGER(11),//瞪羚企业（家
		thousandsOfPeoplePlan:INTEGER(11),//千人计划
		urbanPartnershipScheme:INTEGER(11),//城市合伙人（人
		hundredPeoplePlan:INTEGER(11),//百人计划（人）
		talent3551Plan:INTEGER(11),//3551人才计划（人）
		co_pay:BIGINT, //上缴税费

		patentsAuthorizationNum: INTEGER(11), //  专利授权数
		overBachelor:INTEGER(11),//本科生以上
		intellectualApplyNum: INTEGER(11), //   知识产权申请数
		intellectualAuthorizationNum: INTEGER(11), // 知识产权授权数
		serverOrgCount: INTEGER(11),//中介服务机构
		researchExpenditures: BIGINT(20), //其中：研究与试验发展支出
		//是否有效
		isValid: { type: INTEGER(2), defaultValue: 1 },

		createdAt: DATE,
		updatedAt: DATE,
		deletedAt: DATE,
		intellectualPatentNum: INTEGER(11)
	}

	const ParkCount = app.model.define('parkCount', model, {
		paranoid: true
	})
	ParkCount.associate = function() {
		ParkCount.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
		ParkCount.hasMany(app.pgModel.ParkCountCompanyClass, { foreignKey: 'parkCount_id' })
		ParkCount.hasMany(app.pgModel.ParkCountQualification, { foreignKey: 'parkCount_id' })
		ParkCount.hasMany(app.pgModel.ParkCountServerClass, { foreignKey: 'parkCount_id' })
		ParkCount.hasMany(app.pgModel.ParkCountTalentPlan, { foreignKey: 'parkCount_id' })
		// Park.belongsToMany(app.pgModel.Area,{through: 'areaPark',foreignKey: 'park_id'})
		// Park.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
		// Park.hasMany(app.pgModel.ConfTag,{foreignKey:'park_id'})
		// Park.hasMany(app.pgModel.ConfSetParkAddress,{foreignKey:'park_id'})
		// Park.hasMany(app.pgModel.ConfParkAddress,{foreignKey:'park_id'})
		// Park.hasMany(app.pgModel.ConfTalentPlan,{foreignKey:'park_id'})
		// Park.hasMany(app.pgModel.ConfIndustryConcern,{foreignKey:'park_id'})
		// Park.hasMany(app.pgModel.ConfQualification,{foreignKey:'park_id'})
		// Park.hasMany(app.pgModel.ConfStateOccupancy,{foreignKey:'park_id'})
		// Park.hasMany(app.pgModel.ConfCompanyInfoType,{foreignKey:'park_id'})
		// Park.hasMany(app.pgModel.ConfServerClass,{foreignKey:'park_id'})
		// Park.hasMany(app.pgModel.ConfServerType,{foreignKey:'park_id'})
		// Park.hasMany(app.pgModel.ConfJoinWork,{foreignKey:'park_id'})
		// Park.hasMany(app.pgModel.ConfCompanyClass,{foreignKey:'park_id'})
		// Park.hasMany(app.pgModel.Talent,{foreignKey:'park_id'})
	}
	ParkCount.model = model
	return ParkCount
}
