const Transaction = require('../models/transaction').Transaction

function create(req, res, next) {
  const _patient = req.session.user
  const newTransactions = new Transaction({
    _patient: _patient,
    txs: null
  })
  newTransactions.save((err, newTxs) => {
    if (err) return next(err)
    res.send(newTxs)
  })
}

function update(req, res, next) {
  const _patient = req.params.id
  Transaction.findOneAndUpdate(
    { _patient: _patient },
    { $push: { txs: req.body.tx } },
    { new: true },
    (err, txs) => {
      if (err) return next(err)
      res.send(txs)
    }
  )
}

exports.create = create
exports.update = update

// const Request = require('../models/request').Request
// const HttpError = require('../error').HttpError
//
// const io = req => req.app.get('io')
//
// function create(req, res, next) {
//   const _req = req
//   const uid = req.session.user
//   Request.find(req.body).exec((err, request) => {
//     if (err) return next(err)
//     if (request.length) return next(new HttpError(400, 'Request exist yet.'))
//     const newRequest = new Request(req.body)
//     newRequest.save((err, request) => {
//       if (err) return next(err)
//       Request.findOne({ _id: request._id })
//         .populate('_to _from')
//         .exec((err, _request) => {
//           if (err) return next(err)
//           io(_req).sockets.emit('permReqs', { type: 'create', data: _request })
//         })
//       res.send(request._id)
//     })
//   })
// }
//
// function list(req, res, next) {
//   const key = req.params.account === 'patient' ? '_to' : '_from'
//   Request.find({ [key]: req.session.user  })
//     .populate('_to _from')
//     .exec((err, request) => {
//       if (err) return next(err)
//       res.json(request)
//     })
// }
//
// function remove(req, res, next) {
//   const _req = req
//   Request.findOneAndRemove({ _id: req.params.id }, (err, request) => {
//     if (err) return next(err)
//     io(_req).sockets.emit('permReqs', { type: 'remove', data: request })
//     res.status(200).send()
//   })
// }
//
// function update(req, res, next) {
//   const _req = req
//   Request.findOneAndUpdate(
//     { _id: req.params.id },
//     { $set: req.body },
//     { new: true },
//     (err, request) => {
//       if (err) return next(err)
//       io(_req).sockets.emit('permReqs', { type: 'update', data: request })
//       res.send(request)
//     }
//   )
// }
//
// exports.create = create
// exports.list = list
// exports.remove = remove
// exports.update = update
