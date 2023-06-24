require('dotenv').config()
var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var cors = require('cors')
const { v4: uuidv4 } = require('uuid')
var moment = require('moment')
var routes = require('./src/routes')
// const { planAutomation } = require('./src/helpers/automation')
require('./config/db')

var commonController = require('./helpers/functions')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(function (req, res, next) {
  req.logId = uuidv4()
  req.startTime = moment()
  commonController.checkConsole(req, 'INFO', ['Request Received from the Client'])
  req.on('end', function () {
    req.responseTime = moment().diff(req.startTime, 'milliseconds')
    commonController.checkConsole(req, 'INFO', [req.responseTime, 'Response Sent to the Client'])
  })
  next()
})
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// update membership user if expired at 00:00:00 
// planAutomation();

app.get('/', (req, res) => {
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

