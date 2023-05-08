import 'reflect-metadata'
import express, { json } from 'express'
import { dataSource } from './db/config'
import cors from 'cors'
import routes from './routes'

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err)
  })

const port = process.env.PORT || 4002
const app = express()
app.use(cors())
app.use(json())
app.get('/', function (req, res) {
  res.json({ message: 'Alectrion Equipament' }).status(200)
})
app.use('/equipment', routes)

app.listen(port, () => console.log(`rodando ${port}`))
