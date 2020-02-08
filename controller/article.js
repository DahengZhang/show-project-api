const article = require('../dao/article')

const getAll = async ctx => {
    try {
        ctx.body = {
            code: 200,
            data: await article.all()
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            msg: 'something was wrong'
        }
    }
}

const detail = async ctx => {
    try {
        ctx.body = {
            code: 200,
            data: await article.detail(ctx.params.id)
        }
    } catch (error) {
        ctx.body = {
            code: error.code || 500,
            msg: error.msg || 'something was wrong'
        }
    }
}

const create = async ctx => {
    ctx.verifyParams({
        title: { type: 'string', required: true },
        content: { type: 'string', required: true }
    })
    try {
        ctx.body = {
            code: 200,
            data: await article.create({
                ...ctx.request.body,
                author: ctx.state.user.id
            })
        }
    } catch (error) {
        ctx.throw(500, 'save article fail')
    }
}

const editor = async ctx => {
    ctx.verifyParams({
        title: { type: 'string', required: false },
        content: { type: 'string', required: false }
    })
    try {
        ctx.body = {
            code: 200,
            data: await article.editor({
                id: ctx.params.id,
                author: ctx.state.user.id,
                query: ctx.request.body
            })
        }
    } catch (error) {
        ctx.throw(error.code || 500, error.msg || 'editor article fail')
    }
}

module.exports = {
    getAll,
    detail,
    create,
    editor
}
