const express = require ('express');
const router = express.Router();
const axios = require('axios');
const Todo = require('../models/todo');

const ADYEN_PAY_LINK_URL = 'https://checkout-test.adyen.com/v51/paymentLinks';

router.get('/todos', (req, res, next) => {

  //this will return all the data, exposing only the id and action field to the client
  Todo.find({}, 'action')
    .then(data => res.json(data))
    .catch(next)
});

router.post('/todos', (req, res, next) => {
  if(req.body.action){
    Todo.create(req.body)
      .then(data => res.json(data))
      .catch(next)
  }else {
    res.json({
      error: "The input field is empty"
    })
  }
});

router.delete('/todos/:id', (req, res, next) => {
  Todo.findOneAndDelete({"_id": req.params.id})
    .then(data => res.json(data))
    .catch(next)
});

router.post('/generate-pay-link', (req, res, next) => {
  const adyenData = req.body;

  axios.post(ADYEN_PAY_LINK_URL, adyenData, {headers: {'x-API-key':process.env.ADYEN_API_KEY}})
  .then((response) => {
    console.log(response.data);
    res.json(response.data);
  })
  .catch((error) => {
    console.log(error.response.data);
    res.status(error.response.status).json(error.response.data);
  });
});

module.exports = router;