const { getArgv } = require('../config/utils')

module.exports = require('koa-jwt')({
    secret: getArgv('secret')
})
