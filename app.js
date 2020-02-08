const Koa = require('koa')
const koabody = require('koa-body')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')

const app = new Koa()
const { getArgv } = require('./config/utils')
const authRouter = require('./router/auth')
const articleRouter = require('./router/article')

mongoose.connect(`mongodb://${getArgv('account') || getArgv('collection') || 'show'}:${getArgv('password')}@${getArgv('database') || 'localhost'}/${getArgv('collection') || 'show'}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, () => console.log('mongodb link success!'))
mongoose.connection.on('error', console.error)

const isDev = process.env.NODE_ENV === 'development'

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    await next()
})
app.use(koabody())
app.use(error({
    postFormat: (_, { stack, ...rest }) => isDev ? { stack, ...rest } : rest
}))
app.use(parameter(app))
app.use(authRouter.routes()).use(authRouter.allowedMethods())
    .use(articleRouter.routes()).use(articleRouter.allowedMethods())

app.listen(8000, () => console.log('server is running...'))
