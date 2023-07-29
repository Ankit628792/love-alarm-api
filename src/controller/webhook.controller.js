const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const { RAZORPAY_WEBHOOK_SECRET, STRIPE_WEBHOOK_SECRET } = require('../../config/env');
const Orders = require('../models/order.model');
const Users = require('../models/user.model');
const { stripe } = require('../../helpers');

const razorpayWebhook = async (req, res) => {

    let sign = req.headers["x-razorpay-signature"];
    let secret = RAZORPAY_WEBHOOK_SECRET

    try {
        let valid = validateWebhookSignature(req.body, sign, secret);
        if (valid) {
            let data = JSON.parse(req.body?.toString());
            if (data.event == 'order.paid' || data.event == 'payment.captured') {
                let payment = data.payload.payment.entity;
                let order = await Orders.findOne({ orderId: payment.order_id }).lean().populate('plan', '_id amount noOfDays');
                let validity = new Date();
                validity.setDate(validity.getDate() + order.plan.noOfDays);

                let obj = {
                    status: 'completed',
                    paymentFor: 'subscription',
                    paymentAmount: payment.amount / 100,
                    paymentCurrency: payment.currency,
                    paymentMethod: payment.method,
                    orderId: payment.order_id,
                    paymentId: payment.id,
                    email: payment.email,
                    contact: payment.contact,
                    validUpto: validity,
                    metadata: payment.notes
                }

                let updatedOrder = await Orders.findOneAndUpdate({ orderId: payment.order_id }, obj, { new: true }).lean();

                await Users.findByIdAndUpdate({ _id: updatedOrder.user }, { plan: updatedOrder.plan });
            }
            else if (data.event == 'payment.failed') {
                await Orders.findOneAndDelete({ orderId: payment.order_id })
            }
        }

        res.status(200).send("ok");

    } catch (err) {
        console.log("Webhook Error")
        console.log(err)
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

}


const stripeWebhook = async (req, res) => {

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);

        // Handle the event
        switch (event.type) {
            case 'payment_intent.canceled':
                const paymentIntentCanceled = event.data.object;
                // Then define and call a function to handle the event payment_intent.canceled
                await Orders.findOneAndDelete({ paymentIntentId: paymentIntentCanceled.id })
                break;
            case 'payment_intent.created':
                const paymentIntentCreated = event.data.object;
                // Then define and call a function to handle the event payment_intent.created
                break;
            case 'payment_intent.payment_failed':
                const paymentIntentPaymentFailed = event.data.object;
                // Then define and call a function to handle the event payment_intent.payment_failed
                await Orders.findOneAndDelete({ paymentIntentId: paymentIntentPaymentFailed.id })

                break;
            case 'payment_intent.succeeded':
                const paymentIntentSucceeded = event.data.object;
                // Then define and call a function to handle the event payment_intent.succeeded

                let order = await Orders.findOne({ paymentIntentId: paymentIntentSucceeded.id }).lean().populate('plan', '_id amount noOfDays');

                let validity = new Date();
                validity.setDate(validity.getDate() + order.plan.noOfDays);

                let obj = {
                    status: 'completed',
                    paymentAmount: paymentIntentSucceeded.amount_received / 100,
                    paymentCurrency: paymentIntentSucceeded.currency,

                    paymentMethod: paymentIntentSucceeded.payment_method,
                    payment_method_details: paymentIntentSucceeded.charges.data[0].payment_method_details,
                    paymentIntentId: paymentIntentSucceeded.id,
                    paymentSuccessId: event.id,
                    receipt: paymentIntentSucceeded.charges.data[0].receipt_url,

                    validUpto: validity,

                    metadata: {
                        customer_name: paymentIntentSucceeded.metadata.customer_name,
                        customer_mobile: paymentIntentSucceeded.metadata.customer_mobile
                    }
                }

                let updatedOrder = await Orders.findOneAndUpdate({ paymentIntentId: paymentIntentSucceeded.id }, obj, { new: true }).lean();
                await Users.findByIdAndUpdate({ _id: updatedOrder.user }, { plan: updatedOrder.plan })
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

    } catch (err) {
        console.log("Webhook Error")
        console.log(err)
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Return a 200 res to acknowledge receipt of the event
    res.send();
}


module.exports = { stripeWebhook, razorpayWebhook }