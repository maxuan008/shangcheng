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
        talent_id: {
            type: INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },

        park_id: INTEGER(11),
        company_id: INTEGER(11),
        serverOrg_id: INTEGER(11),

        photo: STRING(100), //照片
        name: STRING(100), //人才姓名
        tags: STRING(200), //人才标签
        sex: INTEGER(2), //性别
        birthDate: DATEONLY, //生日
        education: STRING(50), //学历
        graduateSchool: STRING(200), //毕业学校
        position: STRING(50), //职位
        workExperience: STRING(2000), //工作经历
        introduction: STRING(1000), //工作介绍

        //新增字段
        ID_number: STRING(25), //身份证号:
        email: STRING(150), //  邮箱:
        confMentors_id: INTEGER(11), //导师类别
        confFieldOfTechnology_id: INTEGER(11), //技术领域
        speciality: INTEGER(2), //辅导特长
        servicetype: INTEGER(2), //服务模式
        technicalTitle: STRING(100), // 职称
        existingDuties: STRING(100), //现在职务   === 目前的职务
        duty: STRING(100), //职务
        tutorDetails: TEXT, //辅导企业情况（重点是辅导成功案例）
        societyDetails: TEXT, //主要社会兼职及导师受聘情况
        isMentors: INTEGER(2), //是否为导师
        belongName: STRING(100), //人才所属单位名

        //新加字段
        grade: STRING(100), //专业/年级
        telephone: STRING(100), //联系电话
        weChat: STRING(20), //微信号
        fieldOfTechnology: STRING(20), //技术领域
        isValid: { type: INTEGER(2), defaultValue: 1 }, //是否有效
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: DATE
    }

    const Talent = app.model.define('talent', model, {
        paranoid: true
    })
    Talent.associate = function() {
        Talent.belongsTo(app.pgModel.Company, { foreignKey: 'company_id' })
        Talent.belongsTo(app.pgModel.Park, { foreignKey: 'park_id' })
        Talent.belongsTo(app.pgModel.ServerOrg, { foreignKey: 'serverOrg_id' })
        Talent.belongsToMany(app.pgModel.ConfTalentPlan, {
            through: 'talentConfPlan',
            foreignKey: 'talent_id'
        })
        Talent.hasMany(app.pgModel.TalentConfPlan, { foreignKey: 'talent_id' })
        Talent.hasMany(app.pgModel.ProductTalent, { foreignKey: 'talent_id' })
        // companyFinancing.hasMany(app.pgModel.User,{foreignKey: 'park_id'})
        Talent.belongsToMany(app.pgModel.Product, {
            through: 'productTalent',
            foreignKey: 'talent_id'
        })
        Talent.belongsTo(app.pgModel.ConfFieldOfTechnology, {
            foreignKey: 'confFieldOfTechnology_id'
        })
        Talent.belongsTo(app.pgModel.ConfMentors, { foreignKey: 'confMentors_id' })
    }
    Talent.model = model
    return Talent
}
