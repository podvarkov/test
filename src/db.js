const mongoose = require('mongoose')
const Schema = mongoose.Schema

const connect = () => mongoose.connect(process.env.MONGODB_CONNECTION_STRING)

const TrackEventSchema = new Schema({
  event: { type: String, required: true },
  url: { type: String, required: true },
  title: { type: String, required: true },
  ts: { type: Date, required: true },
  tags: { type: [String], required: true },
})

module.exports = {
  connect,
  models: {
    Track: mongoose.model('track', TrackEventSchema),
  },
}
