const MedicalCard = require('../models/medicalCard').MedicalCard

function create(req, res, next) {
  const patientId = req.session.user
  const data = Object.assign(req.body, { _patient: patientId })
  const newMedicalCard = new MedicalCard(data)
  newMedicalCard.save((err, medicalCard) => {
    if (err) return next(err)
    MedicalCard.findOne({ _id: medicalCard._id })
      .populate('_patient _doctor')
      .exec((err, _medicalCard) => {
        if (err) return next(err)
        res.send(_medicalCard)
      })
  })
}

function list(req, res, next) {
  const key = req.params.type === 'patients' ? '_doctor' : '_patient'
  MedicalCard.find({ [key]: req.session.user })
    .populate('_patient _doctor')
    .exec((err, medicalCard) => {
      if (err) return next(err)
      res.json(medicalCard)
    })
}

function show(req, res, next) {
  MedicalCard.findOne({ _patient: req.params.id })
    .populate('_patient')
    .exec((err, medicalCard) => {
      if (err) return next(err)
      res.json(medicalCard)
    })
}

function remove(req, res, next) {

}

function update(req, res, next) {

}

exports.create = create
exports.list = list
exports.show = show
exports.remove = remove
exports.update = update
