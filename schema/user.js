const { Schema, model } = require('mongoose')

module.exports =  model('user', new Schema({
    __v: {
        type: Number,
        select: false
    },
    id: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    }
}))
