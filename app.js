const express = require('express')
const path = require('path')
const http = require('http')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const checkAuth = require('./middleware/checkAuth')
const config = require('./config')
const db = require('./db')

const errorhandler = require('errorhandler')
const HttpError = require('./error').HttpError

const app = express()
app.set('port', config.get('port'))

const index = require('./routes/index')
const auth = require('./routes/auth')
const user = require('./routes/user')
const request = require('./routes/request')

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(cookieParser())

const MongoStore = require('connect-mongo')(session)
app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: db.connection })
}))

app.use(require('./middleware/sendHttpError'))
app.use(require('./middleware/loadUser'))

app.use('/api/v1/', index)
app.use('/api/v1/auth/', auth)
app.use('/api/v1/user/', checkAuth, user)
app.use('/api/v1/request/', checkAuth, request)

app.use((err, req, res, next) => {
  if (typeof err === 'number') {
    err = new HttpError(err)
  }

  if (err instanceof HttpError) {
    res.sendHttpError(err)
  } else {
    if (app.get('env') === 'development') {
      errorhandler()(err, req, res, next)
    } else {
      console.error(err)
      err = new HttpError(500)
      res.sendHttpError(err)
    }
  }
})

const port = app.get('port')

const server = http.createServer(app)
server.listen(port, () => {
  console.log('Example App listening on port ' + port + '!')
})

const io = require('./socket')(server)
app.set('io', io)
