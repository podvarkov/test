const express = require('express')
const path = require('path')
const cors = require('cors')
const db = require('./db')

const app = express()

app.use(
  express.static(path.join(__dirname, '..', 'public', 'assets', 'js'), {
    index: 'tracker.js',
  })
)

app.post(
  '/track',
  (req, _, next) => {
    // in order to prevent options preflight request we need to send "simple" requests from frontend
    // without additional headers, that is why we need to apply application/json header manually
    // before express.json() to parse req.body
    req.headers['content-type'] = 'application/json'
    next()
  },
  cors(),
  express.json(),
  // main handler
  async (req, res) => {
    const events = req.body
    // validate events
    if (!Array.isArray(events))
      return res.status(422).json({ message: 'Data should be of type Array' })

    const errors = await Promise.all(
      events.map((event) => {
        return db.models.Track.validate(event).catch((error) => ({
          message: error.message,
        }))
      })
    )
    if (errors.filter(Boolean).length > 0) {
      return res.status(422).json({ message: 'Validation error', errors })
    }

    db.models.Track.insertMany(events).catch((error) =>
      console.error('POST /track error', error)
    )

    return res.sendStatus(200)
  }
)

const API_PORT = 8001

exports.start = function () {
  console.log('Connecting to database...')
  db.connect().then(() => {
    console.log('Database connected, starting api server... ')
    app.listen(API_PORT, () => {
      console.log(`Api server is listening on ${API_PORT}...`)
    })
  })
}
