const express = require('express');
const route = express.Router();
const axios = require('axios');
const config = require('../config');

const headers={
    'Authorization':'Basic ' + config.key,
    'Content-Type':'application/json'
}

route.post('/', (req, response, next) => {
    axios.post(
        'https://api.test.paysafe.com/paymenthub/v1/payments',
        {
            "merchantRefNum": req.body.merchantRefNum,
            "customerId": req.body.custId,
            "amount": req.body.amount,
            "currencyCode": "USD",
            "paymentHandleToken": req.body.paymentHandleToken,
            "description": "Magazine subscription"
        },
        {
            headers: headers
        }
    ).then(res => {
        response.status(200).json({
            message: 'successful'
        })
    }).catch(err => {
        response.status(500).json({
            message: 'failed'
        })
    })
})

module.exports = route;