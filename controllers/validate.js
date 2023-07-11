const Joi = require('@hapi/joi')


const registerValidate = (data) => {
    const schema = Joi.object({
        username: Joi.string().required().min(3).max(20),
        email: Joi.string().required().min(13).max(50),
        password: Joi.string().required().min(8).max(20),
    })
    return schema.validate(data)
}

const loginValidate = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().min(13).max(50),
        password: Joi.string().required().min(8).max(20),
    })
    return schema.validate(data)
}

module.exports.loginValidate = loginValidate
module.exports.registerValidate = registerValidate