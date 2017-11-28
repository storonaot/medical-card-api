const db = require('../db')
const Schema = db.Schema

const User = db.models.User

const MedicalCardSchema = new Schema({
  _patient: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  _doctor: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  records: {
    type: Array,
    default: [],
  }
}, { collection: 'medical-card' })

exports.MedicalCard = db.model('MedicalCard', MedicalCardSchema)
