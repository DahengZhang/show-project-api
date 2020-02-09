const userSchema = require('../schema/user')

const getUser = async (id) => {
    return await userSchema.findOne({
        id
    }).select('-_id -email')
}

module.exports = {
    getUser
}
