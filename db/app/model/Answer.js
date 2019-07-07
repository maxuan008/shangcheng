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
		FLOAT,
		BIGINT,
		DOUBLE
	} = app.Sequelize

	const model = {
		answer_id: {
			type: INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},

		answerMould_id: INTEGER(11),

		// 年份
		year: INTEGER,

		// 填报单位
		companyName: STRING(100),

		company_id: INTEGER(11),

		// 经营信息 -------------------------------------

		// 本年度总收入
		yearlyIncoming: BIGINT,

		// 净利润
		netProfit: BIGINT,

		// 出口总额
		exportSum: STRING(30),

		// 年度研究与试验发展经费
		yearlyRDFund: BIGINT,

		// 实际上缴税费
		taxPayed: BIGINT,

		// 国家政策支持 -------------------------------------
		// 承担国家科研和产业化项目（项）
		nationalRDProject: INTEGER,

		// 承担国家科研和产业化获得资助（元）
		nationalRDFinancing: BIGINT,

		// 承担省市区科研开发项目（项）
		ProvinceRDProject: INTEGER,

		// 承担省市区科研开发项目获得资助金额（元）
		ProvinceRDFinancing: BIGINT,

		// 人才信息 -------------------------------------
		// 企业总人数
		total: INTEGER,

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

		// 知识产权 -------------------------------------
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

		//状态：1审核通过, 0待审核， -1：未通过
		flag: { type: INTEGER(2), defaultValue: 0 },

		//来源：1web端, 2app端， 3：小程序端
		source: { type: INTEGER(2), defaultValue: 1 },

		// 备注
		remark: TEXT,

		//火炬字段
		// 是否为火炬计划
		isTorch: { type: INTEGER(3), defaultValue: 0 },

		//==基本信息
		// confFieldOfTechnology_id: INTEGER(11), // 技术领域
		//企业纳税人类型:
		typesOfCorporateTaxpayers: INTEGER(2),

		//是否与创业导师建立辅导关系 "1、是  2、否"
		isBuildTutor: INTEGER(2),

		//是否为高新企业:   "1、是  2、否"
		isHeightCompany: INTEGER(2),

		//主要负责人创业特征
		isCharacteristic: INTEGER(2),

		//企业主要负责人是否为连续创业者: "1、是  2、否"
		isContinuity: INTEGER(2),

		//主要负责人性别 "1、男  2、女"
		principalSex: INTEGER(2),

		// 获天使或风险投资额
		AngelCapitalNum: BIGINT(20),

		//占用场地面积 （平方米）
		floorSpace: FLOAT,

		//企业经济概况
		//在孵企业工业总产值
		incubatorGDP: BIGINT(20),

		//研发机构
		researchOrganization: INTEGER(11),

		//成果转化总数
		TotalNumberAchievements: INTEGER(11),

		//获奖成果
		winningAchievements: INTEGER(11),

		//产出成果
		outputResults: INTEGER(11),

		//其中：依托高校数量
		collegesNum: INTEGER(11),

		//企业知识产权统计下 软件著作权
		// 软件著作权
		intellectualSoftware: INTEGER(11),

		//  专利授权数
		patentsAuthorizationNum: INTEGER(11),

		// 发明专利授权数（件）
		inventionPatentAuthorizationNum: INTEGER(11),

		// 专利申请数
		patentAppNum: INTEGER(11),

		//  发明专利申请数（件）
		inventionPatentApp: INTEGER(11),

		//  拥有有效知识产权数
		availableIntellectualNum: INTEGER(11),

		// 有效发明专利（件）
		intellectualPatentNum: INTEGER(11),

		//  植物新品种
		intellectualNewVarietyPlant: INTEGER(11),

		//  集成电路布图
		intellectualIC: INTEGER(11),

		//  购买国外技术专利
		buyForeignPatentNum: INTEGER(11),

		//  技术合同交易数量
		technicalContractNum: INTEGER(11),

		//   技术合同交易额
		technicalContractToal: BIGINT(20),

		//   当年获得省级以上奖励
		provincialAwards: INTEGER(11),

		//   知识产权申请数
		intellectualApplyNum: INTEGER(11),

		// 知识产权授权数
		intellectualAuthorizationNum: INTEGER(11),

		//人才统计:  火炬只要求 千人计划显示
		//研究与试验发展人员
		research: INTEGER,

		//经营信息--科技活动情况
		//承担各类计划项目
		acceptPlanProject: INTEGER(11),

		//其中：国家级项目
		nationalProject: INTEGER(11),

		//科技活动经费支出总额
		scientificExpenditure: BIGINT(20),

		//其中：研究与试验发展支出
		researchExpenditures: BIGINT(20),

		//其中：新产品开发经费支出
		newProductExpenditure: BIGINT(20),

		//其中：政府拨款
		governmentGrants: BIGINT(20),

		//企业自筹
		self_collected: BIGINT(20),

		//数据填报人
		writeUserName: STRING(150),

		//联系电话
		contactNumber: STRING(20),

		//单位负责人
		companyPrincipal: STRING(150),

		//统计负责人
		statisticsPrincipal: STRING(150),

		//上缴税费
		co_pay: BIGINT,

		//到期时间
		duetime: DATEONLY,

		//企业logo
		logo: STRING(50),

		//企业类别
		confCompanyClass_id: INTEGER(11),

		//在孵状态 1:在孵 0：未在孵
		hatchStatus: { type: INTEGER(2), defaultValue: 1 },

		//联系人
		contact: STRING(100),

		// contactNumber: STRING(20), //联系电话
		//联系人邮箱
		contactEmail: STRING(150),

		// 安全责任人：
		safetyResponsiblePerson: STRING(100),

		//责任人联系电话
		responsiblePersonContactNumber: STRING(20),

		//企 业 登 记 注 册 类 型
		registerType: INTEGER(5),

		//行业类别
		industryType: INTEGER(7),

		//外资来源地
		foreignInvestmentSource: INTEGER(5),

		//企业规模
		scale: INTEGER(5),

		//企业所得税主管税务机关
		taxAuthority: INTEGER(5),

		//企业所得税征收方式
		wayOfTax: INTEGER(5),

		//企业微信公众号全称
		companyWechatPublicAccount: STRING(30),

		//技术领域
		fieldOfTechnology: STRING(20),

		//是否为毕业企业  "1、是  2、否"
		isGraduate: INTEGER(2),

		//是否为创业企业:  "1、是  2、否"
		isStart_upCompany: INTEGER(2),

		//是否有效
		isValid: { type: INTEGER(2), defaultValue: 1 },

		createdAt: DATE,
		updatedAt: DATE,
		deletedAt: DATE,
		companyContactNumber: STRING(20),
		foreignPersonnel: INTEGER,
		part_timeDutyPersonnel: INTEGER,
		temporaryStaff: INTEGER,
		seniorProfessionalTitle: INTEGER,
		mediumProfessionalTitle: INTEGER,
		primaryTitle: INTEGER,
		seniorTech: INTEGER,
		tech30: INTEGER,
		tech40: INTEGER,
		tech50: INTEGER,
		tech60: INTEGER,
		worksCopyright: INTEGER(11),
		softwareCopy: INTEGER(11),
		nationalPatent: INTEGER(11),
		nationalCropVariety: INTEGER(11),
		nationalNewDrug: INTEGER(11),
		nationalFirstclassProtection: INTEGER(11),
		designExclusiveRight: INTEGER(11),
		headName: STRING(100)
	}

	const Answer = app.model.define('answer', model, {
		paranoid: true
	})
	Answer.associate = function() {
		Answer.belongsTo(app.pgModel.AnswerMould, { foreignKey: 'answerMould_id' })
		Answer.hasMany(app.pgModel.AnswerQualification, { foreignKey: 'answer_id' })
		Answer.hasMany(app.pgModel.AnswerTalentPlan, { foreignKey: 'answer_id' })
		Answer.hasMany(app.pgModel.AnswerNationalProject, { foreignKey: 'answer_id' })
		// Answer.belongsTo(app.pgModel.ConfTalentPlan,{foreignKey:'confTalentPlan_id'})
		// companyQualification.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
	}
	Answer.model = model
	return Answer
}
