import { ApiError } from "../error/ApiError.js"
import bcrypt from 'bcrypt'
import jsonwebtoken from "jsonwebtoken"
import { User } from "../models/models.js"

function generateJwt(id, email) {
    return jsonwebtoken.sign(
        { id, email },
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const { email, name, password } = req.body
        if (!email || !password || !name) {
            return next(ApiError.badRequest('Некорретный email, имя или пароль'))
        }

        const condidate = await User.findOne({ where: { email } })
        if (condidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({ email, name, password: hashPassword })
        const token = generateJwt(user.id, user.email)

        await user.update({last_login: new Date()})
        return res.json({token, user})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.badRequest('Пользователя с таким email не существует'))
        }

        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.badRequest('Неверный пароль'))
        }

        if (user.block_status === 1) return next(ApiError.forbidden('Пользователь заблокирован'))

        const token = generateJwt(user.id, user.email)
        await user.update({last_login: new Date()})
        return res.json({token, user})
    }

    async check(req, res) {
       const token = generateJwt(req.user.id, req.user.email)
       const id = req.user.id
       const user = await User.findOne({ where: { id }, attributes: ["id", "name", "email", "last_login", "block_status"]})

       await User.update({last_login: new Date()}, {where: {id}})
       return res.json({token, user})
    }

    async block(req, res, next) {
        const ids = [...[req.query.id]].flat()
        const numericIds = ids.map(Number);
        const blockComplete = await User.update({block_status: 1},{where: {id: numericIds}})

        if (ids.includes(String(req.id))) return next(ApiError.forbidden('Вы заблокированы'))

        return res.json({message: `Пользователи в количестве=${blockComplete} заблокированы`})
    }

    async unblock(req, res, next) {
        const ids = [...[req.query.id]].flat()
        const numericIds = ids.map(Number);
        const blockComplete = await User.update({block_status: 0},{where: {id: numericIds}})

        return res.json({message: `Пользователи в количестве=${blockComplete} разблокированы`})
    }

    async delete(req, res, next) {
        const ids = [...[req.query.id]].flat()
        const numericIds = ids.map(Number);
        const deleteComplete = await User.destroy({where: {id: numericIds}})

        if (ids.includes(String(req.id))) return next(ApiError.forbidden('Ваш аккаунт был удалён'))

        return res.json({message: `Пользователи в количестве=${deleteComplete} удалены`})
    }

    async getAll(req, res) {
        const users = await User.findAll({attributes: ["id", "name", "email", "last_login", "block_status"]})
        return res.json({users})
    }
}

export const userController = new UserController()
