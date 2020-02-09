const articleSchema = require('../schema/article')
const { getUser } = require('./user')

const all = async () => {
    return await articleSchema.aggregate([{
        $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: 'id',
            as: 'author'
        }
    }, {
        $unwind: '$author'
    }, {
        $project: {
            title: '$title',
            author: {
                id: '$author.id',
                name: '$author.name',
                avatar: '$author.avatar'
            },
            content: '$content',
            create_time: '$createTime',
            editor_time: '$editorTime'
        }
    }])
}

const detail = async (id) => {
    try {
        let result = await articleSchema.findById(id)
        if (result) {
            result = result.toObject()
            let author = await getUser(result.author)
            author = author.toObject()
            delete author._id
            result.author = author
            return result
        }
        return Promise.reject({
            code: 400,
            msg: 'cannot find article'
        })
    } catch (error) {
        return Promise.reject({
            code: 500,
            msg: 'something was wrong'
        })
    }
}

const create = async ({ title, author, content }) => {
    const result = await new articleSchema({ title, author, content }).save()
    let tmp = result.toObject()
    delete tmp.__v
    return tmp
}

const _getAuthor = async (id) => {
    try {
        const result = await articleSchema.findById(id)
        const tmp = await getUser(result.author)
        return result && tmp || {}
    } catch (error) {
        return Promise.reject({ code: 400 })
    }
}

const _editor = async (id, query) => {
    try {
        return await articleSchema.findByIdAndUpdate(id, query, { new: true })
    } catch (error) {
        return Promise.reject({ code: 500, msg: 'update fail' })
    }
}

const editor = async ({ id, author, query }) => {
    let _author
    try {
        _author = await _getAuthor(id)
    } catch (error) {
        return Promise.reject({ code: error.code, msg: 'cannot find article' })
    }
    if (_author.id === author) {
        delete query._id
        delete query.author
        delete query.createTime
        query.editorTime = new Date().getTime()
        try {
            let tmp = await _editor(id, query)
            tmp = tmp.toObject()
            tmp.author = _author
            return tmp
        } catch (error) {
            return Promise.reject(error)
        }
    } else {
        return Promise.reject({ code: 403, msg: 'no auth' })
    }
}

module.exports = {
    all,
    detail,
    create,
    editor
}
