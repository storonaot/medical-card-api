const express = require('express')
const router = express.Router()

const Users = require('../controllers/users')

router.post('/signIn', Users.signIn)
router.post('/signUp', Users.signUp)
router.post('/signOut', Users.signOut)

module.exports = router
