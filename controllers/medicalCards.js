const MedicalCard = require('../models/medicalCard').MedicalCard
const Request = require('../models/request').Request
const async = require('async')
const io = req => req.app.get('io')

function create(req, res, next) {
  const _req = req
  const patientId = req.session.user
  const data = Object.assign(req.body, { _patient: patientId })
  const newMedicalCard = new MedicalCard(data)
  newMedicalCard.save((err, medicalCard) => {
    if (err) return next(err)
    MedicalCard.findOne({ _id: medicalCard._id })
      .populate('_patient _doctor')
      .exec((err, _medicalCard) => {
        if (err) return next(err)
        io(_req).sockets.emit('medicalCard', { type: 'create', data: _medicalCard })
      })
    res.send(medicalCard)
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
  const _req = req
  const _patientId = req.session.user
  const _doctorId = req.params.id
  MedicalCard.findOneAndRemove(
    { _patient: _patientId, _doctor: _doctorId },
    (err, medCard) => {
      if (err) return next(err)
      io(_req).sockets.emit('medicalCard', { type: 'remove', data: medCard })
      Request.findOneAndRemove(
        { _to: _patientId, _from: _doctorId },
        (err, request) => {
          if (err) return next(err)
          io(_req).sockets.emit('permReqs', { type: 'remove', data: request })
          res.status(200).send()
        }
      )
    }
  )
}

function update(req, res, next) {
  console.log('update')
  { $and: [ { price: { $ne: 1.99 } }, { price: { $exists: true } } ] }
  const _req = req
  const medCards = []
  const patientId = req.session.user

  async.each(req.body, (item, callback) => {
    // MedicalCard.findOneAndUpdate(
    //   // { _doctor: item._doctor },
    //   { $and: [{ _doctor: item._doctor }, { _patient: patientId } ] },
    //   { $set: { records: item.records } },
    //   { new: true },
    //   (err, medCard) => {
    //     console.log('medCard', medCard)
    //     if (err) return callback(err)
    //     medCards.push(medCard)
    //     io(_req).sockets.emit('medicalCard', { type: 'update', data: medCard })
    //     callback()
    //   }
    // )
    MedicalCard.findOneAndUpdate(
      { $and: [{ _doctor: item._doctor }, { _patient: patientId } ] },
      { $set: { records: item.records } },
      { new: true }
    )
      .populate('_patient')
      .exec((err, medCard) => {
        console.log('err', err)
        if (err) return callback(err)
        medCards.push(medCard)
        io(_req).sockets.emit('medicalCard', { type: 'update', data: medCard })
        callback()
      })
  }, (err) => {
    if (err) return next(err)
    res.json(medCards)
  })
}

exports.create = create
exports.list = list
exports.show = show
exports.remove = remove
exports.update = update
