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
		policy_id: {
			type: INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},

		//园区id
		park_id: INTEGER(11),

		//归属地区
		area_id: INTEGER(11),

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

		//是否发布 -1取消， 0待审核，1审核通过
		issueStatus: { type: INTEGER(2), defaultValue: 1 },

		//超管审核 0待审核，1审核通过 ， 2审核未通过
		auditingStatus: { type: INTEGER(2), defaultValue: 0 },

		//标签
		tags: STRING(800),

		// 0:未获取标签， 1:已获取标签
		tagFlag: { type: INTEGER(2), defaultValue: 0 },

		//链接
		httpLink: STRING(200),

		//范围
		range: STRING(50),

		//报名开始时间
		signUp_start: DATEONLY,

		//报名截止时间
		signUp_end: DATEONLY,

		//数量限制
		numLimit: TEXT,

		//申报条件
		acceptanceRequirments: TEXT,

		//认定程序
		accreditationProgram: TEXT,

		//要求
		requirement: TEXT,

		//对接单位
		abutment: STRING(200),

		//对接单位简称
		abutmentShortName: STRING(200),

		//地址
		address: STRING(500),

		//姓名
		name: STRING(500),

		//对接人电话
		abutmentNum: STRING(50),

		//邮箱
		email: STRING(80),

		//备注
		remark: TEXT,

		simhash1: STRING(16),
		simhash2: STRING(16),
		simhash3: STRING(16),
		simhash4: STRING(16),
		summary: STRING(500),
		count: { type: INTEGER(2), defaultValue: 0 },//匹配企业数
		//是否有效
		isValid: { type: INTEGER(2), defaultValue: 1 },

		createdAt: DATE,
		updatedAt: DATE,
		deletedAt: DATE,
		hash_id: STRING(32)
	}

	const Policy = app.model.define('policy', model, {
		paranoid: true
	})
	Policy.associate = function() {
		Policy.hasMany(app.pgModel.PolicyCompanyPark, { foreignKey: 'policy_id' })
		Policy.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
		// policy.hasMany(app.pgModel.OperationPermission)
	}
	Policy.model = model
	return Policy
}
