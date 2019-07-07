module.exports = app => {
    const { Client } = require('@elastic/elasticsearch')
    const client = new Client({ node: 'http://192.168.0.102:9200' })
    return client
}