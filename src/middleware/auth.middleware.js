const { validateToken } = require('../../helpers')
const Users = require('../models/user.model')

var middleware = {}

async function authMiddleware(req, res, next) {
    try {
        if (req.headers.authorization) {
            let token = req.headers.authorization.split(' ')[1]
            if (token) {
                let payload = validateToken(token);
                if (payload) {
                    req.user = await Users.findOne(payload).populate('Plans', 'name planType');
                    if (req.user) {
                        req.user = req.user.toJSON()
                        if (req.user.status == 'block') {
                            res.status(403).json({ success: false, message: 'Your Account is blocked. Please contact admin.' })
                        } else {
                            next()
                        }
                    } else {
                        res.status(404).json({ success: false, message: 'User Not Found' })
                    }
                } else {
                    res.status(401).json({ success: false, message: 'Unauthorized Request 3' })
                }
            } else {
                res.status(401).json({ success: false, message: 'Unauthorized Request 2' })
            }
        } else {
            res.status(401).json({ success: false, message: 'Unauthorized Request 1' })
        }
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error?.message
        })
    }
}

async function validateSignIn(req, res, next) {
    try {
        if (!req.body.primaryPhone) {
            return res.status(400).json({ message: 'Invalid mobile' })
        }
        req.user = await Users.findOne({ primaryPhone: req.body.primaryPhone })
        if (req.user) {
            if (req.user.status == 'active') {
                next()
            } else {
                return res.status(403).json({ message: 'Your Account is blocked. Please contact admin.' })
            }
        } else {
            validateSignUp(req, res, next)
            // return res.status(400).json({ message: 'Account does not exists. Goto SignUp screen.' })
        }
    } catch (error) {
        res.status(400).json({ message: 'something went wrong', error: error })
    }
}



middleware.authMiddleware = authMiddleware
middleware.validateSignIn = validateSignIn

module.exports = middleware