const exp = require('express')
const app = exp()

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const db = low(new FileSync('db.json'))

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

app.get('/', (req, res) => {
  const restaurants = db.get('restaurants').value()
  return res.json({ msg: 'hello', restaurants })
})

app.listen(port, () => {
  console.info(`>>>>>> Listening on ${port}`)
})
