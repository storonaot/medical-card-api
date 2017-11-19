const express = require('express')
const router = express.Router()

const Transaction = require('../controllers/transactions')

// router.get('/list/:type', MedicalCard.list)
router.get('/', Transaction.show)
router.post('/', Transaction.create)
// router.delete('/:id', MedicalCard.remove)
router.put('/:id', Transaction.update)
//
module.exports = router
