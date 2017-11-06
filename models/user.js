const crypto = require('crypto')
const async = require('async')
// const util = require('util')
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
    type: String,
    default: null
  },
  hashedPassPhrase: {
    type: String,
    required: true
  },
  appPubKey: {
    type: String,
    default: null,
  },
  ethereumPubKey: {
    type: String,
    default: null,
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
})

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

// function AuthError(message) {
//   Error.apply(this, arguments)
//   Error.captureStackTrace(this, AuthError)
//
//   this.message = message
// }
//
// util.inherits(AuthError, Error)
//
// AuthError.prototype.name = 'AuthError'
//
// exports.AuthError = AuthError
