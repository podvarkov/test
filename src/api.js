const express = require('express')
const path = require('path')
const cors = require('cors')

const app = express()

app.use(
  express.static(path.join(__dirname, '..', 'public', 'assets', 'js'), {
    index: 'tracker.js',
  })
)

app.use(cors(), express.json())

app.post(
  '/track',
  (req, _, next) => {
    // in order to prevent options request we need to send "simple" requests from frontend
    // without additional headers, that is why we need to apply application/json header manually
    // before express.json() to parse req.body
    req.headers['content-type'] = 'application/json'
    next()
  },
  cors(),
  express.json(),
  (req, res) => {
    res.sendStatus(201)
  }
)

const API_PORT = process.env.API_PORT || 8001

exports.start = function () {
  app.listen(API_PORT, () => {
    console.log(`Api server is listening on ${API_PORT}...`)
  })
}
