const express = require('express')
const router = express.Router()

const Users = require('../controllers/users')

// router.get('/', checkAuth, Users.show)
router.get('/', Users.show)


module.exports = router
