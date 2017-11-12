const User = require('../models/user').User
const HttpError = require('../error').HttpError

const getUserData = (user) => {
  if (user) {
    return {
      email: user.email,
      isDoctor: user.isDoctor,
      login: user.login,
      personalInfo: user.personalInfo,
      photo: user.photo,
      pubKey: user.pubKey,
      ethAddress: user.ethAddress,
      publicPEM: user.publicPEM,
      _id: user._id
    }
  }
  return null
}

function signIn(req, res, next) {
  const login = req.body.login
  const passPhrase = req.body.passPhrase

  User.authorize(login, passPhrase, (err, user) => {
    if (err) return next(err)
    req.session.user = user._id
    res.send(getUserData(user))
  })
}

// Create new user
function signUp(req, res, next) {
  const newUser = new User(req.body)

  newUser.save((err, user) => {
    if (err) return next(err)
    req.session.user = user._id
    res.send(getUserData(user))
  })
}

function signOut(req, res, next) {
  req.session.destroy()
  res.send({})
}

function show(req, res, next) {
  if (req.user) res.send(getUserData(req.user))
  else res.send(null)
}

function update(req, res, next) {
  User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true },
    (err, newUser) => {
      if (err) return next(err)
      res.send(newUser)
    }
  )
}

function searchPatient(req, res, next) {
  User.findOne(req.body).exec((err, user) => {
    if (err) return next(err)
    if (user && user.personalInfo) return res.send(getUserData(user))
    res.send(null)
  })
}

exports.signIn = signIn
exports.signUp = signUp
exports.signOut = signOut
exports.show = show
exports.update = update
exports.searchPatient = searchPatient
