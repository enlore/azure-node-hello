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

  users: {
    banana: {
      favorites: [],
      ratings: []
    }
  },
  sessions: {}
}).write()

module.exports = db
