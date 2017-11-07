const express = require('express')
const router = express.Router()

const Users = require('../controllers/users')

// router.get('/', checkAuth, Users.show)
router.get('/', Users.show)
router.put('/:id', Users.update)

module.exports = router
