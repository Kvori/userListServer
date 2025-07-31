import express from 'express'
import cors from 'cors'
import sequelize from './db.js'
import router from './routes/index.js'
import errorHandler from './middleware/ErrorHandlingMiddleware.js'


const PORT = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', router)

app.use(errorHandler)

const start = async () => {
  try {
    await sequelize.authenticate()
    console.log('Подключение к БД успешно')

    await sequelize.sync()
    console.log('Синхронизация моделей завершена')

    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`)
    })
  } catch (error) {
    console.error('Ошибка запуска сервера:', error)
  }
}

start()
