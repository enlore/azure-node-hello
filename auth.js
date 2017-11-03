module.exports.secret = function secret (db) {
  return (req, res) => {
    let secret = req.body.secret

    let user = db.get(`users[${secret}]`)
      .value()

    if (user) {
      res.cookie('fud', user.id)

      return res.json({ statusCode: 200 })

    } else {
      return res.status(401).json({ statusCode: 401, message: 'Login failed, bad secret' })
    }
  }
}

module.exports.protect = function protect (req, res, next) {
  if (!req.user)
    return res.status(403).json({ statusCode: 403, message: 'You need to log in to do that' })
  else
    next()
}

module.exports.session = function session (db) {
  return (req, res, next) => {
    let uid = req.cookies['fud']

    const user = db.get(`users`)
      .find(u => u.id === uid)
      .value()

    if (user) {
      req.user = user
      next()
    } else {
      next()
    }
  }
}


