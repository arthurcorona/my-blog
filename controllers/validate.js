const Joi = require('@hapi/joi')

const registerValidate = (data) => {
    const registerSchema = Joi.object({
        username: Joi.string().required().min(3).max(40),
        email:Joi.string().required().min(10).max(80),
        password:Joi.string().required().min(3).max(60)
    })
    return registerSchema.validate(data)
}

const loginValidate = (data) => {
    const loginSchema = Joi.object({
        email:Joi.string().required().min(13).max(80),
        password:Joi.string().required().min(3).max(60)
    })
    return loginSchema.validate(data)
}

module.exports.loginValidate = loginValidate
module.exports.registerValidate = registerValidate