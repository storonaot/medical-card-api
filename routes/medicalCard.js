const express = require('express')
const router = express.Router()

const MedicalCard = require('../controllers/medicalCards')

router.get('/list/:type', MedicalCard.list)
router.get('/:id', MedicalCard.show)
router.post('/', MedicalCard.create)
router.delete('/:id', MedicalCard.remove)
router.put('/:id', MedicalCard.update)

module.exports = router
