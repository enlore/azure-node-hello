const exp = require('express')
const app = exp()

const port = process.env.PORT || 8080

app.get('/', (req, res) => {
  return res.json({ msg: 'hello' })
})

app.listen(port, () => {
  console.info(`>>>>>> Listening on ${port}`)
})
