const jwt = require('jsonwebtoken')
const { getArgv } = require('../config/utils')

const router = new require('koa-router')({
    prefix: '/auth'
})

router.post('/', async ctx => {
    ctx.body = {
        token: jwt.sign({ id: 15684046 }, getArgv('secret'), { expiresIn: '8h' })
    }
})

module.exports = router
