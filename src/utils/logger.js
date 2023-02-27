const expressWinston = require('express-winston')
const winston = require('winston') // for transports.Console

const initLogger = (app, env) => {
    if (env.LOG === '0') {
        console.log('winston log disabled.')
    } else {
        console.log('winston log enabled.')
        app.use(expressWinston.logger({
            transports: [
                new winston.transports.Console({
                    json: true,
                    colorize: true
                })
            ]
        }))
    }
}

module.exports = { initLogger }