const db = require('../db')
const Schema = db.Schema

const User = db.models.User

const TransactionSchema = new Schema({
  _patient: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  txs: {
    type: Array,
    default: null
  }
}, { collection: 'transaction' })

exports.Transaction = db.model('Transaction', TransactionSchema)
