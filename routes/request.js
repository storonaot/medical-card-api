const express = require('express')
const router = express.Router()

const Request = require('../controllers/requests')

router.post('/', Request.create)
router.get('/list/:account', Request.list)
router.delete('/:id', Request.remove)
router.put('/:id', Request.update)
router.get('/params/:to', Request.getByParams)
module.exports = router
