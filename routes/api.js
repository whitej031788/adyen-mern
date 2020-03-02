const express = require ('express');
const router = express.Router();
const axios = require('axios');

const ADYEN_PAY_LINK_URL = 'https://checkout-test.adyen.com/v51/paymentLinks';
const ADYEN_PAY_METHOD_URL = 'https://checkout-test.adyen.com/v51/paymentMethods';
const ADYEN_PAY_URL = 'https://checkout-test.adyen.com/v51/payments';

router.post('/adyen-generate-pay-link', (req, res, next) => {
  const adyenData = req.body;

  axios.post(ADYEN_PAY_LINK_URL, adyenData, {headers: {'x-API-key':process.env.ADYEN_API_KEY}})
  .then((response) => {
    res.json(response.data);
  })
  .catch((error) => {
    res.status(error.response.status).json(error.response.data);
  });
});

router.post('/adyen-payment-methods', (req, res, next) => {
  const payMethodData = req.body;
  console.log(payMethodData);
  axios.post(ADYEN_PAY_METHOD_URL, payMethodData, {headers: {'x-API-key':process.env.ADYEN_API_KEY}})
  .then((response) => {
    res.json(response.data);
  })
  .catch((error) => {
    res.status(error.response.status).json(error.response.data);
  });
});

router.post('/adyen-pay', (req, res, next) => {
  paymentData = req.body;

  axios.post(ADYEN_PAY_URL, paymentData, {headers: {'x-API-key':process.env.ADYEN_API_KEY}})
  .then((response) => {
    console.log(response);
    res.json(response.data);
  })
  .catch((error) => {
    console.log(error);
    res.status(error.response.status).json(error.response.data);
  });
});

module.exports = router;