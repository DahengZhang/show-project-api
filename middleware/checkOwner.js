module.exports = async function (ctx, next) {
    if (ctx.params.id !== ctx.state.user.id) {
        ctx.throw(403, 'forbidden')
    }
    await next()
}
