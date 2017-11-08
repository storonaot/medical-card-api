const express = require('express')
const router = express.Router()

const Users = require('../controllers/users')

router.get('/', Users.show)
// router.put('/:id', Users.update)
router.put('/personal-info/:id', Users.updatePersonalInfo)

module.exports = router
