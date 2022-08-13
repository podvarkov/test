const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, '..', 'public', 'static'), {}))
const SERVE_PORT = process.env.STATIC_PORT || 8000

exports.start = function () {
  app.listen(SERVE_PORT, () => {
    console.log(`Serving static on ${SERVE_PORT}...`)
  })
}
