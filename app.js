const { resolve } = require('path')

const exp = require('express')
const app = exp()
const bod = require('body-parser')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const db = low(new FileSync('db.json'))

const Restaurant = require('./models/Restaurant.js')

db.defaults({
  restaurants: [
    {
      name: 'Five Points Pizza',
      tags: ['pizza']
    }
  ],

  tags: {
    pizza: ['Five Points Pizza']
  },

  users: []
}).write()

const port = process.env.PORT || 8080

app.use(bod.json())

app.get('/', (req, res) => {
  return res.sendFile(resolve(__dirname, 'client', 'index.html'))
})

app.get('/api/restaurants', (req, res) => {
  const restaurants = db.get('restaurants').value()
  return res.json({ msg: 'hello', restaurants })
})

app.post('/api/restaurants', (req, res) => {
  let ro = db._.pick(req.body, [
    'name',
    'address',
    'tags'
  ])

  if (!ro.name || !ro.address) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Name and Address are required'
    })
  }

  console.info(ro)

  let r = new Restaurant({
    name: ro.name,
    address: ro.address,
    tags: ro.tags
  })

  r.save(db)

  return res.json({ message: 'You did it!', statusCode: 200, data: {  restaurant: r }})
})

app.listen(port, () => {
  console.info(`>>>>>> Listening on ${port}`)
})
