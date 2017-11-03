const DEBUG = false
const { resolve } = require('path')
const uuid = require('uuid')

const exp = require('express')
const app = exp()
const bod = require('body-parser')
const cki = require('cookie-parser')

const auth = require('./auth')

const db = require('./db')
const Restaurant = require('./models/Restaurant.js')

function log (req, res, next) { console.info(`request ${req.method} ${req.path}`); next() }

const port = process.env.PORT || 8080

// cookies
app.use(cki())
app.use(auth.session(db))

// deserialize json POST bodies
app.use(bod.json())

// talk about your day
app.use(log)

app.get('/', (req, res) => { return res.sendFile(resolve(__dirname, 'client', 'index.html')) })
app.post('/api/secret', auth.secret(db))

app.get('/api/restaurants', (req, res) => {
  const restaurants = db.get('restaurants').value()
  return res.json({ msg: 'hello', restaurants })
})

// do i know you?
app.use(auth.protect) // hereafter are protected routes

app.get('/api/favs', (req, res) => {
  return res.json({ favorites: req.user.favorites })
})

app.post('/api/favs', (req, res) => {
  let user = req.user
  let rid = req.body.restaurantId

  // if this is already a fav, unfav
  if (user.favorites.some(f => f === rid)) {
    let idx = user.favorites.indexOf(rid)

    user.favorites.splice(idx, 1)

    req.user = user // being lazy and not forcing refetch

    // else fav it
  } else {
    user.favorites.push(rid)
  }

  // now update the user
  db.get('users')
    .find(u => u.id === user.id)
    .assign(user)
    .write()

  return res.json({ statusCode: 200, message: 'Fav toggled' })
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
    tags: ro.tags,
    uploader: req.user.id
  })

  r.save(db)

  return res.json({ message: 'You did it!', statusCode: 200, data: {  restaurant: r }})
})

app.listen(port, () => {
  console.info(`>>>>>> Listening on http://localhost:${port}`)
})
