const express = require('express');
const route=express.Router();
const axios = require('axios');
const config = require('../config');

const headers={
    'Authorization':'Basic ' + config.key,
    'Content-Type':'application/json'
}

route.post('/', (req,response,next) => {
    const refnum=req.body.merchantRefNum

    //Checking if a customer exists with the given username(MerchantCustomerId)
    axios.get('https://api.test.paysafe.com/paymenthub/v1/customers?merchantCustomerId='+ refnum, {
        headers: headers,
        validateStatus: function (status) {
            return status >= 200 && status < 500; // default
          }
    })
    .then(res=>{
        //If customer already exists, API is retuning statusCode 200 
        if(res.status=='200'){
        
            const custId=res.data.id

            //Generating singleUseCustomerToken for that customer
            axios.post('https://api.test.paysafe.com/paymenthub/v1/customers/'+custId+'/singleusecustomertokens',
                        {
                            "merchantRefNum": refnum,
                            "paymentTypes": [
                                    "CARD"
                                ]
                        },
                        {
                            headers: headers
                        }
                    )
              .then(resp=>{
                  if(resp.status=='201'){
                    //Returning singleUseCustomerToken
                    response.status(200).json({
                        message:'successful',
                        token:resp.data.singleUseCustomerToken,
                        id:resp.data.customerId
                    })
                  }
              }).catch(err => {
                response.status(500).json({
                    message:'get customer failure',
                })
            })

        }
        else if(res.status=='404'){
            //Customer doesnt exist. So first creating a customerId(Customer)
            axios.post('https://api.test.paysafe.com/paymenthub/v1/customers',
            {
                "merchantCustomerId": refnum,
                "locale": "en_US",
                "firstName": "John",
                "middleName": "James",
                "lastName": "Smith",
                "dateOfBirth": {
                  "year": 1981,
                  "month": 10,
                  "day": 24
                },
                "email": "john.smith@email.com",
                "phone": "777-444-8888",
                "ip": "192.0.126.111",
                "gender": "M",
                "nationality": "Canadian",
                "cellPhone": "777-555-8888"
            },
            {
                headers: headers
            }).then(res1 => {
                //With CustomerId created, generating singleUseCustomerToken
                const custId=res1.data.id
                axios.post('https://api.test.paysafe.com/paymenthub/v1/customers/'+custId+'/singleusecustomertokens',
                            {
                                "merchantRefNum": refnum,
                                "paymentTypes": [
                                    "CARD"
                                    ]               
                            },
                            {
                                headers: headers
                            }
                        ).then(res2=>{
                            if(res2.status=='201'){
                                //Returning singleUseCustomerToken
                                response.status(200).json({
                                        message:'successful',
                                        token:res.data.singleUseCustomerToken,
                                        id:res.data.customerId
                                    })
                            }
                        }).catch(err => {
                            response.status(500).json({
                                message:'customer token creation failure',
                            })
                        })
            })
        }
    })
    .catch(err => {
        response.status(500).json({
            message:'customer search failure',
            })
    })
} 
);


module.exports = route;