import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth'

const app = express()

app.use(
  cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: '*',
    allowedHeaders: ['*']
  })
)
app.use(express.json())

app.use('/auth', authRoutes)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})