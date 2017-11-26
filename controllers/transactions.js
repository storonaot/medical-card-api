const Transaction = require('../models/transaction').Transaction

const io = req => req.app.get('io')

function create(req, res, next) {
  const _patient = req.session.user
  const newTransactions = new Transaction({
    _patient: _patient,
    txs: []
  })
  newTransactions.save((err, newTxs) => {
    if (err) return next(err)
    res.send(newTxs)
  })
}

function update(req, res, next) {
  const _req = req
  const _patient = req.params.id

  Transaction.findOneAndUpdate(
    { _patient: _patient },
    {
      $set: { updated: Date.now() },
      $push: { txs: req.body.tx }
    },
    // { $push: { txs: req.body.tx } },
    { new: true },
    (err, txs) => {
      if (err) return next(err)
      io(_req).sockets.emit('transaction', { type: 'add', data: txs })
      res.send(txs)
    }
  )
}

function show(req, res, next) {
  const patientId = req.session.user
  Transaction.findOne({ _patient: patientId })
    .exec((err, txs) => {
      if (err) return next(err)
      res.json(txs)
    })
}

exports.create = create
exports.update = update
exports.show = show
