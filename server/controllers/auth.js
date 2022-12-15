import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Register user
export const register = async (req, res) => {
    try {
        //req - то, что приходит со стороны клиента(на бекенд). body - данные которые мы отправили на фронте
        //res - через него отправляем данные назад на сторону клиента
        const { username, password } = req.body

        const isUsed = await User.findOne({ username })

        if (isUsed) {
            return res.json({
                message: "Данный username уже занят",
            })
        }
        // Сложность пароля
        const salt = bcrypt.genSaltSync(10)
        // Хешируем пароль
        const hash = bcrypt.hashSync(password, salt)

        const newUser = new User({
            username,
            password: hash,
        })

        const token = jwt.sign(
            {
                id: newUser._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        )

        // Сохраняем пользователя в базе данных
        await newUser.save()

        res.json({
            newUser,
            message: "Регистрация прошла успешно.",
        })
    } catch (error) {
        res.json({ message: "Ошибка при создании пользователя." })
    }
}

// Login user
export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) {
            return res.json({
                message: "Такого юзера не существует.",
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.json({
                message: "Неверный пароль",
            })
        }
        // jwt проверяет авторизацию(если не вошли в систему, то не можем добавлять посты)
        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        )

        res.json({
            token,
            user,
            message: "Вы вошли в систему",
        })
    } catch (error) {
        res.json({ message: "Ошибка при авторизации." })
    }
}

// Get Me
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            return res.json({
                message: "Такого юзера не существует.",
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        )

        res.json({
            user,
            token,
        })
    } catch (error) {
        res.json({ message: "Нет доступа." })
    }
}
