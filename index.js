import express, { json } from 'express'
import { createServer } from 'http'
import cors from 'cors'
const app = express()

import { publicRouter } from './routes.js'

app.use(cors())
app.use(json())

app.use('/api', publicRouter)

createServer(app).listen(3000, () => {
  console.log('App Creator Server running on port 3000')
})