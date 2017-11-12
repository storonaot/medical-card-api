const Request = require('../models/request').Request
const HttpError = require('../error').HttpError

function create(req, res, next) {
  Request.find(req.body).exec((err, request) => {
    if (err) return next(err)
    // if (request.length) return res.status(400).send({ error: 'Request exist yet.' });
    if (request.length) return next(new HttpError(400, 'Request exist yet.'))
    const newRequest = new Request(req.body)
    newRequest.save((err, request) => {
      if (err) return next(err)
      res.send(request._id)
    })
  })
}

function list(req, res, next) {
  const key = req.params.account === 'patient' ? '_to' : '_from'
  Request.find({ [key]: req.session.user  })
    .populate('_to _from')
    .exec((err, request) => {
      if (err) return next(err)
      res.json(request)
    })
}

exports.create = create
exports.list = list

// Data.find( { $query: { user: req.user }, $orderby: { dateAdded: -1 } } function ( results ) {
//     ...
// })
