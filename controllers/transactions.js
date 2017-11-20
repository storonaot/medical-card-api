const Transaction = require('../models/transaction').Transaction

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
