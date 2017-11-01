const uuid = require('uuid')

function Restaurant (opts) {
  this.collection = 'restaurants'
  this.timestamp = Date.now()

  this.id      = opts.id || null
  this.name    = opts.name || ""
  this.address = opts.address || ""
  this.images  = opts.images || []
  this.tags    = opts.tags || []
}

Restaurant.prototype.save = function save (db) {
  this.timestamp = Date.now()

  // extant
  if (this.id) {
    db.get(this.collection)
      .find({ id: this.id })
      .assign(db._.omit(this, 'collection'))
      .write()

  } else {
    this.id = uuid.v1()

    db.get(this.collection)
      .push(db._.omit(this, 'collection'))
      .write()
  }
}

module.exports = Restaurant
