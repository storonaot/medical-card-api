const db = require('../db')
const Schema = db.Schema

const User = db.models.User

const RequestSchema = new Schema({
  _to: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  _from: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['send', 'cancel', 'success'],
    default: 'send'
  }
}, { collection: 'request' })

exports.Request = db.model('Request', RequestSchema)
