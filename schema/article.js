const { Schema, model } = require('mongoose')

module.exports =  model('article', new Schema({
    __v: {
        type: Number,
        select: false
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createTime: {
        type: Number,
        required: true,
        default: new Date().getTime()
    },
    editorTime: {
        type: Number,
        required: true,
        default: new Date().getTime()
    }
}))
