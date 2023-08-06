require('dotenv').config()
var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var cors = require('cors')
const { v4: uuidv4 } = require('uuid')
var moment = require('moment')
var routes = require('./src/routes')
const { checkConsole } = require('./helpers/functions')

const Users = require('./src/models/user.model')
require('./config/db')
const automation = require('./helpers/automation')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// app.use(function (req, res, next) {
//   req.logId = uuidv4()
//   req.startTime = moment()
//   checkConsole(req, 'INFO', ['Request Received from the Client'])
//   req.on('end', function () {
//     req.responseTime = moment().diff(req.startTime, 'milliseconds')
//     checkConsole(req, 'INFO', [req.responseTime, 'Response Sent to the Client'])
//   })
//   next()
// })

app.use(cors({ origin: true, credentials: true }))
app.use((req, res, next) => {
  if ((req.originalUrl).includes('/api/v2/webhook')) {
    next(); // Do nothing with the body because I need it in a raw state.
  } else {
    express.json()(req, res, next);  // ONLY do express.json() if the received request is NOT a WebHook.
  }
});
app.use((req, res, next) => {
  if ((req.originalUrl).includes('/api/v2/webhook')) {
    next();
  } else {
    express.urlencoded({ extended: false })(req, res, next);
  }
});
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// automation to save storage
automation();

app.get('/', async (req, res) => {
  let users = await Users.find({ gender: 'male' }).sort({ createdAt: -1 }).limit(10).lean();
  let location2 = {
    type: 'Point',
    coordinates: [77.0143618, 28.593715]
  }

  // for (let item of users) {
  //   await Users.updateOne({ _id: item._id }, { location: location2 }, { new: true }).then(res => console.log(res))
  // }


  res.status(200).send({ msg: `Backend moves to active state on ${new Date().toString()}` })
})

app.use("/api/v2/", routes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app

