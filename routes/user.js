const express = require('express')
const router = express.Router()

const Users = require('../controllers/users')

router.get('/', Users.show)
// router.put('/:id', Users.update)
router.put('/:id', Users.update)

module.exports = router
