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
		STRING
	} = app.Sequelize

	const model = {
		answerMould_id: {
			type: INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},

		uidStr: STRING(100),
		quesMould_id: INTEGER(11),
		park_id: INTEGER(11),

		// 年份
		year: INTEGER(11),

		//问卷名称
		mouldName: STRING(150),

		// 填报单位
		companyName: { type: INTEGER(2), defaultValue: 0 },

		// 经营信息 -------------------------------------

		// 本年度总收入
		yearlyIncoming: { type: INTEGER(2), defaultValue: 0 },

		// 净利润
		netProfit: { type: INTEGER(2), defaultValue: 0 },

		// 出口总额
		exportSum: { type: INTEGER(2), defaultValue: 0 },

		// 年度研究与试验发展经费
		yearlyRDFund: { type: INTEGER(2), defaultValue: 0 },

		// 实际上缴税费
		taxPayed: { type: INTEGER(2), defaultValue: 0 },

		// 人才信息 -------------------------------------
		// 企业总人数
		total: { type: INTEGER(2), defaultValue: 0 },

		// 研发人员
		rd: { type: INTEGER(2), defaultValue: 0 },

		// 科技活动人员
		science: { type: INTEGER(2), defaultValue: 0 },

		// 博士人数
		doctor: { type: INTEGER(2), defaultValue: 0 },

		// 硕士人数
		master: { type: INTEGER(2), defaultValue: 0 },

		// 研究生人数
		postgraduate: { type: INTEGER(2), defaultValue: 0 },

		// 本科生人数
		bachelor: { type: INTEGER(2), defaultValue: 0 },

		// 留学人数
		overseas: { type: INTEGER(2), defaultValue: 0 },

		// 大专生人数
		college: { type: INTEGER(2), defaultValue: 0 },

		// 中专生人数
		secondary: { type: INTEGER(2), defaultValue: 0 },

		// 接纳大学生、研究生实习人员
		internship: { type: INTEGER(2), defaultValue: 0 },

		// 接纳应届毕业生就业人员
		freshGraduate: { type: INTEGER(2), defaultValue: 0 },

		// 知识产权 -------------------------------------
		//自主知识产权
		proprietary: { type: INTEGER(2), defaultValue: 0 },

		//发明专利
		invention: { type: INTEGER(2), defaultValue: 0 },

		//实用专利
		utility: { type: INTEGER(2), defaultValue: 0 },

		//外观专利
		appearance: { type: INTEGER(2), defaultValue: 0 },

		PCT: { type: INTEGER(2), defaultValue: 0 },

		//商标
		trademark: { type: INTEGER(2), defaultValue: 0 },

		//著作权
		copyright: { type: INTEGER(2), defaultValue: 0 },

		//集成电路
		ic: { type: INTEGER(2), defaultValue: 0 },

		//软件产品
		software: { type: INTEGER(2), defaultValue: 0 },

		// 国家政策支持 -------------------------------------
		// 承担国家科研和产业化项目（项）
		nationalRDProject: { type: INTEGER(2), defaultValue: 0 },

		// 承担国家科研和产业化获得资助（元）
		nationalRDFinancing: { type: INTEGER(2), defaultValue: 0 },

		// 承担省市区科研开发项目（项）
		ProvinceRDProject: { type: INTEGER(2), defaultValue: 0 },

		// 承担省市区科研开发项目获得资助金额（元）
		ProvinceRDFinancing: { type: INTEGER(2), defaultValue: 0 },

		//状态1：生效中, 0挂起
		flag: { type: INTEGER(2), defaultValue: 1 },

		//密码
		password: STRING(100),

		// 备注
		remark: TEXT,

		//火炬字段
		// 是否为火炬计划
		isTorch: { type: INTEGER(3), defaultValue: 0 },

		//==基本信息
		// 技术领域
		confFieldOfTechnology_id: { type: INTEGER(3), defaultValue: 1 },

		//企业纳税人类型:
		typesOfCorporateTaxpayers: { type: INTEGER(3), defaultValue: 0 },

		//是否与创业导师建立辅导关系 "1、是  2、否"
		isBuildTutor: { type: INTEGER(3), defaultValue: 0 },

		//是否为高新企业:   "1、是  2、否"
		isHeightCompany: { type: INTEGER(3), defaultValue: 0 },

		//主要负责人创业特征
		isCharacteristic: { type: INTEGER(3), defaultValue: 0 },

		//企业主要负责人是否为连续创业者: "1、是  2、否"
		isContinuity: { type: INTEGER(3), defaultValue: 0 },

		//主要负责人性别 "1、男  2、女"
		principalSex: { type: INTEGER(3), defaultValue: 0 },

		// 获天使或风险投资额
		AngelCapitalNum: { type: INTEGER(3), defaultValue: 0 },

		//占用场地面积 （平方米）
		floorSpace: { type: INTEGER(3), defaultValue: 0 },

		//企业经济概况
		//在孵企业工业总产值
		incubatorGDP: { type: INTEGER(3), defaultValue: 0 },

		//研发机构
		researchOrganization: { type: INTEGER(3), defaultValue: 0 },

		//成果转化总数
		TotalNumberAchievements: { type: INTEGER(3), defaultValue: 0 },

		//获奖成果
		winningAchievements: { type: INTEGER(3), defaultValue: 0 },

		//产出成果
		outputResults: { type: INTEGER(3), defaultValue: 0 },

		//其中：依托高校数量
		collegesNum: { type: INTEGER(3), defaultValue: 0 },

		//企业知识产权统计下 软件著作权
		// 软件著作权
		intellectualSoftware: { type: INTEGER(3), defaultValue: 0 },

		//  专利授权数
		patentsAuthorizationNum: { type: INTEGER(3), defaultValue: 0 },

		// 发明专利授权数（件）
		inventionPatentAuthorizationNum: { type: INTEGER(3), defaultValue: 0 },

		// 专利申请数
		patentAppNum: { type: INTEGER(3), defaultValue: 0 },

		//  发明专利申请数（件）
		inventionPatentApp: { type: INTEGER(3), defaultValue: 0 },

		//  拥有有效知识产权数
		availableIntellectualNum: { type: INTEGER(3), defaultValue: 0 },

		// 有效发明专利（件）
		intellectualPatentNum: { type: INTEGER(3), defaultValue: 0 },

		//  植物新品种
		intellectualNewVarietyPlant: { type: INTEGER(3), defaultValue: 0 },

		//  集成电路布图
		intellectualIC: { type: INTEGER(3), defaultValue: 0 },

		//  购买国外技术专利
		buyForeignPatentNum: { type: INTEGER(3), defaultValue: 0 },

		//  技术合同交易数量
		technicalContractNum: { type: INTEGER(3), defaultValue: 0 },

		//   技术合同交易额
		technicalContractToal: { type: INTEGER(3), defaultValue: 0 },

		//   当年获得省级以上奖励
		provincialAwards: { type: INTEGER(3), defaultValue: 0 },

		//   知识产权申请数
		intellectualApplyNum: { type: INTEGER(3), defaultValue: 0 },

		// 知识产权授权数
		intellectualAuthorizationNum: { type: INTEGER(3), defaultValue: 0 },

		//人才统计:  火炬只要求 千人计划显示
		//研究与试验发展人员
		research: { type: INTEGER(3), defaultValue: 0 },

		//经营信息--科技活动情况
		//承担各类计划项目
		acceptPlanProject: { type: INTEGER(3), defaultValue: 0 },

		//其中：国家级项目
		nationalProject: { type: INTEGER(3), defaultValue: 0 },

		//科技活动经费支出总额
		scientificExpenditure: { type: INTEGER(3), defaultValue: 0 },

		//其中：研究与试验发展支出
		researchExpenditures: { type: INTEGER(3), defaultValue: 0 },

		//其中：新产品开发经费支出
		newProductExpenditure: { type: INTEGER(3), defaultValue: 0 },

		//其中：政府拨款
		governmentGrants: { type: INTEGER(3), defaultValue: 0 },

		//企业自筹
		self_collected: { type: INTEGER(3), defaultValue: 0 },

		//数据填报人
		writeUserName: { type: INTEGER(3), defaultValue: 0 },

		//联系电话
		contactNumber: { type: INTEGER(3), defaultValue: 0 },

		//单位负责人
		companyPrincipal: { type: INTEGER(3), defaultValue: 0 },

		//统计负责人
		statisticsPrincipal: { type: INTEGER(3), defaultValue: 0 },

		//上缴税费
		co_pay: { type: INTEGER(3), defaultValue: 0 },

		//到期时间
		duetime: DATEONLY,

		//企业logo
		logo: {
			type: INTEGER(2),
			defaultValue: 0
		},

		//企业类别
		confCompanyClass_id: {
			type: INTEGER(2),
			defaultValue: 0
		},

		//在孵状态 1:在孵 0：未在孵
		hatchStatus: {
			type: INTEGER(2),
			defaultValue: 0
		},

		//联系人
		contact: {
			type: INTEGER(2),
			defaultValue: 0
		},

		// contactNumber: STRING(20), //联系电话
		//联系人邮箱
		contactEmail: {
			type: INTEGER(2),
			defaultValue: 0
		},

		// 安全责任人：
		safetyResponsiblePerson: {
			type: INTEGER(2),
			defaultValue: 0
		},

		//责任人联系电话
		responsiblePersonContactNumber: {
			type: INTEGER(2),
			defaultValue: 0
		},

		//企 业 登 记 注 册 类 型
		registerType: {
			type: INTEGER(2),
			defaultValue: 0
		},

		//行业类别
		industryType: {
			type: INTEGER(2),
			defaultValue: 0
		},

		//外资来源地
		foreignInvestmentSource: {
			type: INTEGER(2),
			defaultValue: 0
		},

		//企业规模
		scale: {
			type: INTEGER(2),
			defaultValue: 0
		},

		//企业所得税主管税务机关
		taxAuthority: {
			type: INTEGER(2),
			defaultValue: 0
		},

		//企业所得税征收方式
		wayOfTax: {
			type: INTEGER(2),
			defaultValue: 0
		},

		//企业微信公众号全称
		companyWechatPublicAccount: {
			type: INTEGER(2),
			defaultValue: 0
		},

		//技术领域
		fieldOfTechnology: {
			type: INTEGER(2),
			defaultValue: 0
		},

		//是否为毕业企业  "1、是  2、否"
		isGraduate: {
			type: INTEGER(2),
			defaultValue: 0
		},

		//是否为创业企业:  "1、是  2、否"
		isStart_upCompany: {
			type: INTEGER(2),
			defaultValue: 0
		},

		//是否有效
		isValid: { type: INTEGER(2), defaultValue: 1 },

		createdAt: DATE,
		updatedAt: DATE,
		deletedAt: DATE,
		companyContactNumber: { type: INTEGER(2), defaultValue: 0 },
		foreignPersonnel: { type: INTEGER(2), defaultValue: 0 },
		part_timeDutyPersonnel: { type: INTEGER(2), defaultValue: 0 },
		temporaryStaff: { type: INTEGER(2), defaultValue: 0 },
		seniorProfessionalTitle: { type: INTEGER(2), defaultValue: 0 },
		mediumProfessionalTitle: { type: INTEGER(2), defaultValue: 0 },
		primaryTitle: { type: INTEGER(2), defaultValue: 0 },
		seniorTech: { type: INTEGER(2), defaultValue: 0 },
		tech30: { type: INTEGER(2), defaultValue: 0 },
		tech40: { type: INTEGER(2), defaultValue: 0 },
		tech50: { type: INTEGER(2), defaultValue: 0 },
		tech60: { type: INTEGER(2), defaultValue: 0 },
		worksCopyright: { type: INTEGER(2), defaultValue: 0 },
		softwareCopy: { type: INTEGER(2), defaultValue: 0 },
		nationalPatent: { type: INTEGER(2), defaultValue: 0 },
		nationalCropVariety: { type: INTEGER(2), defaultValue: 0 },
		nationalNewDrug: { type: INTEGER(2), defaultValue: 0 },
		nationalFirstclassProtection: { type: INTEGER(2), defaultValue: 0 },
		designExclusiveRight: { type: INTEGER(2), defaultValue: 0 },
		headName: { type: INTEGER(2), defaultValue: 0 }
	}

	const AnswerMould = app.model.define('answerMould', model, {
		paranoid: true
	})
	AnswerMould.associate = function() {
		AnswerMould.belongsTo(app.pgModel.QuesMould, { foreignKey: 'quesMould_id' })
		AnswerMould.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
		AnswerMould.hasMany(app.pgModel.AnswerMouldQualification, { foreignKey: 'answerMould_id' })
		AnswerMould.hasMany(app.pgModel.AnswerMouldTalentPlan, { foreignKey: 'answerMould_id' })
		AnswerMould.belongsToMany(app.pgModel.ConfQualification, {
			through: 'answerMouldQualification',
			foreignKey: 'answerMould_id'
		})
		AnswerMould.belongsToMany(app.pgModel.ConfTalentPlan, {
			through: 'answerMouldTalentPlan',
			foreignKey: 'answerMould_id'
		})
		AnswerMould.hasMany(app.pgModel.Answer, { foreignKey: 'answerMould_id' })
		// AnswerMould.belongsTo(app.pgModel.ConfTalentPlan,{foreignKey:'confTalentPlan_id'})
		// companyQualification.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
	}
	AnswerMould.model = model
	return AnswerMould
}
