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
        companyTalentStat_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        company_id: INTEGER(11),

        // 人才信息 -------------------------------------
        year: INTEGER, // 所属年份
        month: INTEGER, // 所属月份
        total: INTEGER, // 企业总人数
        rd: INTEGER, // 研发人员
        science: INTEGER, // 科技活动人员
        doctor: INTEGER, // 博士人数
        master: INTEGER, // 硕士人数
        postgraduate: INTEGER, // 研究生人数
        bachelor: INTEGER, // 本科生人数
        overseas: INTEGER, // 留学人数
        college: INTEGER, // 大专生人数
        secondary: INTEGER, // 中专生人数
        internship: INTEGER, // 接纳大学生、研究生实习人员
        freshGraduate: INTEGER, // 接纳应届毕业生就业人员

        research: INTEGER, //研究与试验发展人员
        // intellectualApplyNum: {type:INTEGER(3) , defaultValue: 0 } , // 知识产权申请数
        // intellectualAuthorizationNum: {type:INTEGER(3) , defaultValue: 0 } , // 知识产权授权数

        //高新工具新增字段
        foreignPersonnel: INTEGER,  //外籍人员
        part_timeDutyPersonnel: INTEGER, //兼职人员
        temporaryStaff: INTEGER,  //临时聘用人员
        seniorProfessionalTitle: INTEGER,  //高级职称
        mediumProfessionalTitle: INTEGER, //中级职称
        primaryTitle: INTEGER, //初级职称
        seniorTech: INTEGER,  //高级技工
        tech30: INTEGER, //30及以下
        tech40: INTEGER, //31-40
        tech50: INTEGER, //41-50
        tech60 : INTEGER, //51及以上
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const CompanyTalentStat = app.model.define('companyTalentStat', model, {
        paranoid: true
    })
    CompanyTalentStat.associate = function() {
        CompanyTalentStat.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
        // companyTalentStat.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
        CompanyTalentStat.belongsToMany(app.pgModel.ConfTalentPlan, {
            through: 'companyTalentStatAndPlan',
            foreignKey: 'companyTalentStat_id'
        })
        CompanyTalentStat.hasMany(app.pgModel.CompanyTalentStatAndPlan,{foreignKey:'companyTalentStat_id'})
    }
    CompanyTalentStat.model = model
    return CompanyTalentStat
}
