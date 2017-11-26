const crypto = require('crypto')
const async = require('async')
const HttpError = require('../error').HttpError

const db = require('../db')
const Schema = db.Schema

const UserSchema = new Schema({
  login: {
    type: String,
    required: true,
    uniq: true
  },
  email: {
    type: String,
    required: true,
    uniq: true
  },
  isDoctor: {
    type: Boolean
  },
  personalInfo: {
    type: Schema.Types.Mixed,
    default: null
  },
  medicalCard: {
    type: String,
    default: null
  },
  hashedPassPhrase: {
    type: String,
    required: true
  },
  ethAddress: {
    type: String,
    default: null
  },
  publicKey: {
    type: String,
    default: null
  },
  photo: {
    type: String
  },
  salt: {
    type: String,
    required: true
  },
  updated: {
    type: Number,
    default: Date.now()
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { collection: 'user' })

UserSchema.methods.encryptPassword = function(passPhrase) {
  return crypto.createHmac('sha1', this.salt).update(passPhrase).digest('hex')
}

UserSchema.methods.checkPassword = function(passPhrase) {
  return this.encryptPassword(passPhrase) === this.hashedPassPhrase
}

UserSchema.virtual('passPhrase')
  .set(function(passPhrase) {
    this._plainPassword = passPhrase
    this.salt = Math.random() + ''
    this.hashedPassPhrase = this.encryptPassword(passPhrase)
  })
  .get(function() { return this._plainPassword })

UserSchema.statics.authorize = function(login, passPhrase, callback) {
  const User = this

  async.waterfall([
    (callback) => { User.findOne({ login: login }, callback) },
    (user, callback) => {
      if (user) {
        if (user.checkPassword(passPhrase)) callback(null, user)
        else callback(new HttpError(403, 'Пароль неверен'))
      }
    }
  ], callback)
}

exports.User = db.model('User', UserSchema)
