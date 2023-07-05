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
const { stripe } = require('./helpers')
const { STRIPE_WEBHOOK_SECRET } = require('./config/env')
require('./config/db')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(function (req, res, next) {
  req.logId = uuidv4()
  req.startTime = moment()
  checkConsole(req, 'INFO', ['Request Received from the Client'])
  req.on('end', function () {
    req.responseTime = moment().diff(req.startTime, 'milliseconds')
    checkConsole(req, 'INFO', [req.responseTime, 'Response Sent to the Client'])
  })
  next()
})
app.use(cors({ origin: true, credentials: true }))
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next(); // Do nothing with the body because I need it in a raw state.
  } else {
    express.json()(req, res, next);  // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
  }
});
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    express.urlencoded({ extended: false })(req, res, next);
  }
});
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// update membership user if expired at 00:00:00 
// planAutomation();

app.get('/', (req, res) => {
  res.status(200).send({ msg: `Backend moves to active state on ${new Date().toString()}` })
})


app.use("/api/v2/", routes);


app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log("Webhook Error")
    console.log(err)
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }


  // Handle the event
  switch (event.type) {
    case 'payment_intent.canceled':
      const paymentIntentCanceled = event.data.object;
      // Then define and call a function to handle the event payment_intent.canceled
      break;
    case 'payment_intent.created':
      const paymentIntentCreated = event.data.object;
      // Then define and call a function to handle the event payment_intent.created
      break;
    case 'payment_intent.payment_failed':
      const paymentIntentPaymentFailed = event.data.object;
      // Then define and call a function to handle the event payment_intent.payment_failed
      break;
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded

      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a 200 res to acknowledge receipt of the event
  res.send();
});

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

