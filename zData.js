let createdPaymentIntent = {
    "id": "evt_3NQMkxSHt26EdXYY1LneYbsC",
    "object": "event",
    "api_version": "2020-08-27",
    "created": 1688529115,
    "data": {
        "object": {
            "id": "pi_3NQMkxSHt26EdXYY1tBZONjh",
            "object": "payment_intent",
            "amount": 2000,
            "amount_capturable": 0,
            "amount_details": {
                "tip": {}
            },
            "amount_received": 0,
            "application": null,
            "application_fee_amount": null,
            "automatic_payment_methods": null,
            "canceled_at": null,
            "cancellation_reason": null,
            "capture_method": "automatic",
            "charges": {
                "object": "list",
                "data": [],
                "has_more": false,
                "total_count": 0,
                "url": "/v1/charges?payment_intent=pi_3NQMkxSHt26EdXYY1tBZONjh"
            },
            "client_secret": "pi_3NQMkxSHt26EdXYY1tBZONjh_secret_XbZlDFXtJuRaxglrthKojyv51",
            "confirmation_method": "automatic",
            "created": 1688529115,
            "currency": "usd",
            "customer": null,
            "description": "testing the app",
            "invoice": null,
            "last_payment_error": null,
            "latest_charge": null,
            "livemode": false,
            "metadata": {
                "customer_name": "User test"
            },
            "next_action": null,
            "on_behalf_of": null,
            "payment_method": null,
            "payment_method_options": {
                "card": {
                    "installments": null,
                    "mandate_options": null,
                    "network": null,
                    "request_three_d_secure": "automatic"
                }
            },
            "payment_method_types": [
                "card"
            ],
            "processing": null,
            "receipt_email": null,
            "review": null,
            "setup_future_usage": null,
            "shipping": {
                "address": {
                    "city": "San Francisco",
                    "country": "US",
                    "line1": "510 Townsend St",
                    "line2": null,
                    "postal_code": "98140",
                    "state": "CA"
                },
                "carrier": null,
                "name": "My Name",
                "phone": null,
                "tracking_number": null
            },
            "source": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "requires_payment_method",
            "transfer_data": null,
            "transfer_group": null
        }
    },
    "livemode": false,
    "pending_webhooks": 1,
    "request": {
        "id": "req_ocN0T7QJfV1UOO",
        "idempotency_key": "32fb2293-c165-4680-82cf-21a43c1e56dd"
    },
    "type": "payment_intent.created"
}


// Payment ID is pi_3NQMkxSHt26EdXYY1tBZONjh at e.data.object.id
// Payment Amount is 20000 / 100 at e.data.object.amount
// Payment Amount is 20000 / 100 at e.data.object.amount_received
// Payment currency is 'usd' at e.data.object.currency
// Payment created is 1688529115 * 1000 at e.data.object.created
// Payment metadata at e.data.object.metadata
// Payment payment_method as Payment method id at e.data.object.payment_method
// Payment payment_method_details as Payment method id at e.data.object.payment_method_details
// Payment receipt_url at e.data.object.receipt_url
// Payment event type as "payment_intent.succeeded"at e.type
//

let model = {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'completed', 'failed'], required: true },
    paymentFor: { type: String, enum: ['subscription', 'referral'], required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'plans', required: true },
    paymentAmount: { type: Number, required: true },
    paymentCurrency: { type: String, required: true },

    paymentMethod: { type: String },
    payment_method_details: { type: Object },
    paymentIntentId: { type: String },
    paymentSuccessId: { type: String },
    receipt: { type: String },

    validUpto: { type: Date },

    metadata: { type: Object }
}

let successPayment = {
    "id": "evt_3NQMkxSHt26EdXYY1vVscdCq",
    "object": "event",
    "api_version": "2020-08-27",
    "created": 1688529309,
    "data": {
        "object": {
            "id": "pi_3NQMkxSHt26EdXYY1tBZONjh",
            "object": "payment_intent",
            "amount": 2000,
            "amount_capturable": 0,
            "amount_details": {
                "tip": {}
            },
            "amount_received": 2000,
            "application": null,
            "application_fee_amount": null,
            "automatic_payment_methods": null,
            "canceled_at": null,
            "cancellation_reason": null,
            "capture_method": "automatic",
            "charges": {
                "object": "list",
                "data": [
                    {
                        "id": "ch_3NQMkxSHt26EdXYY1RP8dPsg",
                        "object": "charge",
                        "amount": 2000,
                        "amount_captured": 2000,
                        "amount_refunded": 0,
                        "application": null,
                        "application_fee": null,
                        "application_fee_amount": null,
                        "balance_transaction": "txn_3NQMkxSHt26EdXYY1tVGfbs8",
                        "billing_details": {
                            "address": {
                                "city": null,
                                "country": "US",
                                "line1": null,
                                "line2": null,
                                "postal_code": "54444",
                                "state": null
                            },
                            "email": null,
                            "name": null,
                            "phone": null
                        },
                        "calculated_statement_descriptor": "A WEB DESIGN COMPANY",
                        "captured": true,
                        "created": 1688529309,
                        "currency": "usd",
                        "customer": null,
                        "description": "testing the app",
                        "destination": null,
                        "dispute": null,
                        "disputed": false,
                        "failure_balance_transaction": null,
                        "failure_code": null,
                        "failure_message": null,
                        "fraud_details": {},
                        "invoice": null,
                        "livemode": false,
                        "metadata": {
                            "customer_name": "User test"
                        },
                        "on_behalf_of": null,
                        "order": null,
                        "outcome": {
                            "network_status": "approved_by_network",
                            "reason": null,
                            "risk_level": "normal",
                            "risk_score": 60,
                            "seller_message": "Payment complete.",
                            "type": "authorized"
                        },
                        "paid": true,
                        "payment_intent": "pi_3NQMkxSHt26EdXYY1tBZONjh",
                        "payment_method": "pm_1NQMo4SHt26EdXYYGv1lRWnP",
                        "payment_method_details": {
                            "card": {
                                "brand": "visa",
                                "checks": {
                                    "address_line1_check": null,
                                    "address_postal_code_check": "pass",
                                    "cvc_check": "pass"
                                },
                                "country": "US",
                                "exp_month": 4,
                                "exp_year": 2026,
                                "fingerprint": "waDFB31pL3GzyeC3",
                                "funding": "credit",
                                "installments": null,
                                "last4": "4242",
                                "mandate": null,
                                "network": "visa",
                                "network_token": null,
                                "three_d_secure": null,
                                "wallet": null
                            },
                            "type": "card"
                        },
                        "receipt_email": null,
                        "receipt_number": null,
                        "receipt_url": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xSXU1NW1TSHQyNkVkWFlZKJ3Tk6UGMgZkFrpiU_c6LBavNM5_Vd4RcRnrJwc_mnCCPQTkrhisHe4gUghMwt1gNf1GXNcEdVDW2Aqu",
                        "refunded": false,
                        "refunds": {
                            "object": "list",
                            "data": [],
                            "has_more": false,
                            "total_count": 0,
                            "url": "/v1/charges/ch_3NQMkxSHt26EdXYY1RP8dPsg/refunds"
                        },
                        "review": null,
                        "shipping": {
                            "address": {
                                "city": "San Francisco",
                                "country": "US",
                                "line1": "510 Townsend St",
                                "line2": null,
                                "postal_code": "98140",
                                "state": "CA"
                            },
                            "carrier": null,
                            "name": "My Name",
                            "phone": null,
                            "tracking_number": null
                        },
                        "source": null,
                        "source_transfer": null,
                        "statement_descriptor": null,
                        "statement_descriptor_suffix": null,
                        "status": "succeeded",
                        "transfer_data": null,
                        "transfer_group": null
                    }
                ],
                "has_more": false,
                "total_count": 1,
                "url": "/v1/charges?payment_intent=pi_3NQMkxSHt26EdXYY1tBZONjh"
            },
            "client_secret": "pi_3NQMkxSHt26EdXYY1tBZONjh_secret_XbZlDFXtJuRaxglrthKojyv51",
            "confirmation_method": "automatic",
            "created": 1688529115,
            "currency": "usd",
            "customer": null,
            "description": "testing the app",
            "invoice": null,
            "last_payment_error": null,
            "latest_charge": "ch_3NQMkxSHt26EdXYY1RP8dPsg",
            "livemode": false,
            "metadata": {
                "customer_name": "User test"
            },
            "next_action": null,
            "on_behalf_of": null,
            "payment_method": "pm_1NQMo4SHt26EdXYYGv1lRWnP",
            "payment_method_options": {
                "card": {
                    "installments": null,
                    "mandate_options": null,
                    "network": null,
                    "request_three_d_secure": "automatic"
                }
            },
            "payment_method_types": [
                "card"
            ],
            "processing": null,
            "receipt_email": null,
            "review": null,
            "setup_future_usage": null,
            "shipping": {
                "address": {
                    "city": "San Francisco",
                    "country": "US",
                    "line1": "510 Townsend St",
                    "line2": null,
                    "postal_code": "98140",
                    "state": "CA"
                },
                "carrier": null,
                "name": "My Name",
                "phone": null,
                "tracking_number": null
            },
            "source": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
        }
    },
    "livemode": false,
    "pending_webhooks": 1,
    "request": {
        "id": "req_nwH0YzDGZ1yRNC",
        "idempotency_key": "e2e64921-dce7-4e62-ae94-5c2c0d155dd3"
    },
    "type": "payment_intent.succeeded"
}




let razorpay = {
    "entity": "event",
    "account_id": "acc_M9zZ80lvwYihkf",
    "event": "order.paid",
    "contains": [
        "payment",
        "order"
    ],
    "payload": {
        "payment": {
            "entity": {
                "id": "pay_MFH9fj2rHx0cvM",
                "entity": "payment",
                "amount": 2000,
                "currency": "USD",
                "base_amount": 164090,
                "base_currency": "INR",
                "status": "captured",
                "order_id": "order_MFH9MHMyrM7Wz1",
                "invoice_id": null,
                "international": false,
                "method": "card",
                "amount_refunded": 0,
                "refund_status": null,
                "captured": true,
                "description": "Credits towards consultation",
                "card_id": "card_MFH9fmrMafFyPF",
                "card": {
                    "id": "card_MFH9fmrMafFyPF",
                    "entity": "card",
                    "name": "",
                    "last4": "1111",
                    "network": "Visa",
                    "type": "debit",
                    "issuer": null,
                    "international": false,
                    "emi": false,
                    "sub_type": "consumer",
                    "token_iin": null
                },
                "bank": null,
                "wallet": null,
                "vpa": null,
                "email": "ankit628792@gmail.com",
                "contact": "+918178823493",
                "notes": {
                    "customer_name": "Suman",
                    "customer_mobile": "+918178823493"
                },
                "fee": 3282,
                "tax": 0,
                "error_code": null,
                "error_description": null,
                "error_source": null,
                "error_step": null,
                "error_reason": null,
                "acquirer_data": {
                    "auth_code": "904822"
                },
                "created_at": 1689685822
            }
        },
        "order": {
            "entity": {
                "id": "order_MFH9MHMyrM7Wz1",
                "entity": "order",
                "amount": 2000,
                "amount_paid": 2000,
                "amount_due": 0,
                "currency": "USD",
                "receipt": "receipt#1",
                "offer_id": null,
                "status": "paid",
                "attempts": 1,
                "notes": {
                    "customer_name": "Suman",
                    "customer_mobile": "+918178823493"
                },
                "created_at": 1689685804
            }
        }
    },
    "created_at": 1689685847
}




// SIGHTENGINE 


// sample response 
let responseFailed = {
    "status": "success",
    "request": {
      "id": "req_eAotaaxuMX4FZIXHU5c3m",
      "timestamp": 1691818395.4572,
      "operations": 16
    },
    "summary": {
      "action": "reject",
      "reject_prob": 0.9,
      "reject_reason": [
        {
          "id": "quality.bad",
          "text": "Bad technical quality"
        }
      ]
    },
    "nudity": {
      "sexual_activity": 0.01,
      "sexual_display": 0.01,
      "erotica": 0.01,
      "suggestive": 0.01,
      "suggestive_classes": {
        "bikini": 0.01,
        "cleavage": 0.01,
        "male_chest": 0.01,
        "lingerie": 0.01,
        "miniskirt": 0.01,
        "male_underwear": 0.01,
        "other": 0.01
      },
      "none": 0.99
    },
    "offensive": {
      "prob": 0.01,
      "nazi": 0.01,
      "confederate": 0.01,
      "supremacist": 0.01,
      "terrorist": 0.01,
      "middle_finger": 0.01
    },
    "weapon": 0.01,
    "alcohol": 0.01,
    "drugs": 0.01,
    "medical_drugs": 0.01,
    "recreational_drugs": 0.01,
    "gore": {
      "prob": 0.01
    },
    "skull": {
      "prob": 0.01
    },
    "text": {
      "profanity": [],
      "personal": [],
      "link": [],
      "social": [],
      "extremism": [],
      "medical": [],
      "drug": [],
      "weapon": [],
      "ignored_text": false,
      "has_artificial": 0.01,
      "has_natural": 0.01
    },
    "qr": {
      "personal": [],
      "link": [],
      "social": [],
      "profanity": [],
      "blacklist": []
    },
    "faces": [
      {
        "x1": 0.1633,
        "y1": 0.2,
        "x2": 0.4867,
        "y2": 0.6833,
        "features": {
          "left_eye": {
            "x": 0.42,
            "y": 0.3833
          },
          "right_eye": {
            "x": 0.2833,
            "y": 0.4167
          },
          "nose_tip": {
            "x": 0.4,
            "y": 0.4933
          },
          "left_mouth_corner": {
            "x": 0.4433,
            "y": 0.5567
          },
          "right_mouth_corner": {
            "x": 0.36,
            "y": 0.5833
          }
        },
        "attributes": {
          "female": 0.99,
          "male": 0.01,
          "minor": 0.28,
          "sunglasses": 0.15
        },
        "celebrity": [
          {
            "name": "Courtland Mead",
            "prob": 0.02
          },
          {
            "name": "Sawyer Sweeten",
            "prob": 0.01
          }
        ]
      }
    ],
    "scam": {
      "prob": 0.12
    },
    "tobacco": {
      "prob": 0.01
    },
    "gambling": {
      "prob": 0.01
    },
    "money": {
      "prob": 0.01
    },
    "type": {
      "photo": 0.99,
      "illustration": 0.01
    },
    "quality": {
      "score": 0.1
    },
    "media": {
      "id": "med_eAotrgzDBmWmgXFtiuGcO",
      "uri": "zmpddip1rm2hf0mapcnr.jpg"
    },
    "workflow": {
      "id": "wfl_epz5DajP0UhKRHceXiJEC"
    }
  }
  
  // success Detailed results
  let responseSuccess = {
    "status": "success",
    "request": {
      "id": "req_eAovxz8jnSI5qrMOGThL4",
      "timestamp": 1691818514.232626,
      "operations": 16
    },
    "summary": {
      "action": "accept",
      "reject_prob": 0.1,
      "reject_reason": []
    },
    "nudity": {
      "sexual_activity": 0.01,
      "sexual_display": 0.01,
      "erotica": 0.01,
      "suggestive": 0.01,
      "suggestive_classes": {
        "bikini": 0.01,
        "cleavage": 0.01,
        "male_chest": 0.01,
        "lingerie": 0.01,
        "miniskirt": 0.01,
        "male_underwear": 0.01,
        "other": 0.01
      },
      "none": 0.99
    },
    "offensive": {
      "prob": 0.01,
      "nazi": 0.01,
      "confederate": 0.01,
      "supremacist": 0.01,
      "terrorist": 0.01,
      "middle_finger": 0.01
    },
    "weapon": 0.01,
    "alcohol": 0.01,
    "drugs": 0.01,
    "medical_drugs": 0.01,
    "recreational_drugs": 0.01,
    "gore": {
      "prob": 0.01
    },
    "skull": {
      "prob": 0.01
    },
    "text": {
      "profanity": [],
      "personal": [],
      "link": [],
      "social": [],
      "extremism": [],
      "medical": [],
      "drug": [],
      "weapon": [],
      "ignored_text": false,
      "has_artificial": 0.01,
      "has_natural": 0.01
    },
    "qr": {
      "personal": [],
      "link": [],
      "social": [],
      "profanity": [],
      "blacklist": []
    },
    "faces": [
      {
        "x1": 0.3217,
        "y1": 0.1933,
        "x2": 0.7092,
        "y2": 0.7058,
        "features": {
          "left_eye": {
            "x": 0.5892,
            "y": 0.4108
          },
          "right_eye": {
            "x": 0.42,
            "y": 0.4
          },
          "nose_tip": {
            "x": 0.4933,
            "y": 0.4917
          },
          "left_mouth_corner": {
            "x": 0.5742,
            "y": 0.5742
          },
          "right_mouth_corner": {
            "x": 0.4275,
            "y": 0.565
          }
        },
        "attributes": {
          "female": 0.01,
          "male": 0.99,
          "minor": 0.06,
          "sunglasses": 0.57
        },
        "celebrity": [
          {
            "name": "Jackky Bhagnani",
            "prob": 0.12
          },
          {
            "name": "Shabbir Ahluwalia",
            "prob": 0.1
          },
          {
            "name": "Immortal Technique",
            "prob": 0.08
          },
          {
            "name": "Pablo Sandoval",
            "prob": 0.08
          },
          {
            "name": "French Montana",
            "prob": 0.03
          }
        ]
      }
    ],
    "scam": {
      "prob": 0.08
    },
    "tobacco": {
      "prob": 0.01
    },
    "gambling": {
      "prob": 0.01
    },
    "money": {
      "prob": 0.01
    },
    "type": {
      "photo": 0.99,
      "illustration": 0.01
    },
    "quality": {
      "score": 0.92
    },
    "media": {
      "id": "med_eAovkj6uT02lEv392aozb",
      "uri": "IMG_20210925_094852_859.webp"
    },
    "workflow": {
      "id": "wfl_epz5DajP0UhKRHceXiJEC"
    }
  }
