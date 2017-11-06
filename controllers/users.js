const User = require('../models/user').User
const HttpError = require('../error').HttpError

const getUserData = (user) => ({
  email: user.email,
  isDoctor: user.isDoctor,
  login: user.login,
  personalInfo: user.personalInfo,
  _id: user._id
})

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

function show(req, res, next) {
  console.log('show')
  if (req.user) res.send(getUserData(req.user))
  else res.send(null)
}

exports.signIn = signIn
exports.signUp = signUp
exports.show = show
