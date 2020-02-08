const auth = require('../middleware/checkAuth')
const router = new require('koa-router')({
    prefix: '/article'
})
const { getAll, detail, create, editor } = require('../controller/article')

router.get('/', getAll)

router.get('/:id', detail)

router.post('/', auth, create)

router.patch('/:id', auth, editor)

module.exports = router
