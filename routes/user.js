const express = require('express')
const router = express.Router()

const Users = require('../controllers/users')

router.get('/', Users.show)
router.put('/:id', Users.update)
router.post('/search-patient', Users.searchPatient)


module.exports = router
