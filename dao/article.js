const articleSchema = require('../schema/article')

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
        const result = await articleSchema.findById(id)
        return result || Promise.reject({
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
        return result.author
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
    if (_author === author) {
        delete query._id
        delete query.author
        delete query.createTime
        query.editorTime = new Date().getTime()
        try {
            return await _editor(id, query)
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
