const axios = require('axios');
const express = require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const craeteCustomerRoute = require('./routes/createCustomer');
const paymentRoute = require('./routes/payment');
const app=express(); 

app.use(bodyParser.json());
app.use(cors());


app.use((req,res,next) => {
    //res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/create-customer', craeteCustomerRoute)

app.use('/payment', paymentRoute)


app.listen(process.env.PORT||8085);

