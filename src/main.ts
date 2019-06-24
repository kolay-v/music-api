import 'dotenv/config'
import express from 'express'
import routes from './routes'

const { PORT } = process.env

const app = express()
routes(app)
app.listen(PORT || 3000)
