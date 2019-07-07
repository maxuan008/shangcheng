const amqp = require('amqplib')

module.exports =  app => {

    let client =  amqp.connect(app.config.rabbitmq.url)
        .then(function(conn) {
            return conn.createChannel()
        })

    return client 

}

