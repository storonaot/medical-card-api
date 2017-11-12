const express = require('express')
const router = express.Router()

const Request = require('../controllers/requests')

router.post('/', Request.create)
router.get('/list/:account', Request.list)

module.exports = router
