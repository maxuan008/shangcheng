module.exports=app=>{
  const Sequelize = require('sequelize')

  let DevMysqlSeq = new Sequelize('xc_dev', 'hd_dev', 'Veily@2018', {
    host: '39.104.57.134',
    port: 8221,
    dialect: 'mysql', //|'mariadb'|'sqlite'|'postgres'|'mssql'
    timezone: '+08:00',
    define: {
      freezeTableName: true,
      underscored: false,
    }
  })

  return DevMysqlSeq
}