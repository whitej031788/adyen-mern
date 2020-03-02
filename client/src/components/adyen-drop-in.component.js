import React, { Component } from 'react';
import axios from 'axios';

export default class AdyenDropIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      currency: '',
      countryCode: '',
      merchantAccount: 'JamieAdyenTestECOM',
      channel: 'Web',
      error: '',
      reference: '',
      returnUrl: 'http://localhost:3000/thank-you',
      paymentMethods: []
    }

    this.paymentMethodUrl = '/api/adyen-payment-methods';
    this.paymentUrl = '/api/adyen-pay';

    const script = document.createElement('script');
    script.src = 'https://checkoutshopper-live.adyen.com/checkoutshopper/sdk/3.5.0/adyen.js';
    script.integrity = 'sha384-MpcW2OFcC1/y5nwF6UmvRfDXGISpg1rowHVybiS+wJObkUwgFpvbdpJxR2/bwmeA';
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);

    const adyenCss = document.createElement('link');
    adyenCss.rel = 'stylesheet';
    adyenCss.href = 'https://checkoutshopper-live.adyen.com/checkoutshopper/sdk/3.5.0/adyen.css';
    adyenCss.integrity = 'sha384-aWycvW8Dygg+6QHTq56FJMi4CJBjQt4LbRO3zWUuyfbv0A8g3rb5FR/vHyHKfiY0';
    adyenCss.crossOrigin = 'anonymous';
    document.body.appendChild(adyenCss);

    this.getPaymentMethods = this.getPaymentMethods.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value});
  }

  makePayment(data) {
    let self = this;

    axios.post(this.paymentUrl, this.formatPaymentData())
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
      self.setState({error: error.message});
    });
  }

  makeDetailsCall(data) {
    let self = this;

    console.log(data);
  }

  getPaymentMethods(e) {
    e.preventDefault();
    let self = this;
    this.setState({paymentMethods: [], error: ''});

    axios.post(this.paymentMethodUrl, this.formatPayMethodData())
    .then((response) => {
      console.log(response.data);
      const configuration = {
        locale: "en-US", // The shopper's locale. For a list of supported locales, see https://docs.adyen.com/checkout/components-web/localization-components.
        environment: "test", // When you're ready to accept live payments, change the value to one of our live environments https://docs.adyen.com/checkout/drop-in-web#testing-your-integration.  
        originKey: "pub.v2.8015830904573463.aHR0cDovL2xvY2FsaG9zdDozMDAw.89NTrtKp5euwF6xYxZD4xrlt8QRVLhQMCEUpr_2n1yM", // Your website's Origin Key. To find out how to generate one, see https://docs.adyen.com/user-management/how-to-get-an-origin-key.
        paymentMethodsResponse: response.data // The payment methods response returned in step 1.
      };
      const checkout = new window.AdyenCheckout(configuration);

      const dropin = checkout
        .create('dropin', {
          paymentMethodsConfiguration: {
            applepay: { // Example required configuration for Apple Pay
              configuration: {
                merchantName: 'Adyen Test merchant', // Name to be displayed on the form
                merchantIdentifier: 'adyen.test.merchant' // Your Apple merchant identifier as described in https://developer.apple.com/documentation/apple_pay_on_the_web/applepayrequest/2951611-merchantidentifier
              },
              onValidateMerchant: (resolve, reject, validationURL) => {
              // Call the validation endpoint with validationURL.
              // Call resolve(MERCHANTSESSION) or reject() to complete merchant validation.
              }
            },
            paywithgoogle: { // Example required configuration for Google Pay
              environment: "TEST", // Change this to PRODUCTION when you're ready to accept live Google Pay payments
              configuration: {
              gatewayMerchantId: "YourCompanyOrMerchantAccount", // Your Adyen merchant or company account name. Remove this field in TEST.
              merchantIdentifier: "12345678910111213141" // Required for PRODUCTION. Remove this field in TEST. Your Google Merchant ID as described in https://developers.google.com/pay/api/web/guides/test-and-deploy/deploy-production-environment#obtain-your-merchantID
              }
            },
            card: { // Example optional configuration for Cards
              hasHolderName: true,
              holderNameRequired: true,
              enableStoreDetails: true,
              hideCVC: false, // Change this to true to hide the CVC field for stored cards
              name: 'Credit or debit card'
            }
          },
          onSubmit: (state, dropin) => {
            self.makePayment(state.data)
              // Your function calling your server to make the /payments request
              .then(action => {
                dropin.handleAction(action);
                // Drop-in handles the action object from the /payments response
              })
              .catch(error => {
                throw Error(error);
              });
          },
          onAdditionalDetails: (state, dropin) => {
            self.makeDetailsCall(state.data)
              // Your function calling your server to make a /payments/details request
              .then(action => {
                dropin.handleAction(action);
                // Drop-in handles the action object from the /payments/details response
              })
              .catch(error => {
                throw Error(error);
              });
          }
        })
        .mount('#dropin');
    })
    .catch((error) => {
      console.log(error);
      self.setState({error: error.message});
    });
  }

  formatPayMethodData() {
    let obj = {};

    obj.amount = {};
    obj.amount.value = parseInt(this.state.amount);
    obj.amount.currency = this.state.currency;
    obj.merchantAccount = this.state.merchantAccount;
    obj.countryCode = this.state.countryCode;
    obj.channel = this.state.channel;

    return obj;
  }

  formatPaymentData(paymentMethod) {
    let obj = {};

    obj.amount = {};
    obj.amount.value = parseInt(this.state.amount);
    obj.amount.currency = this.state.currency;
    obj.merchantAccount = this.state.merchantAccount;
    obj.paymentMethod = paymentMethod;
    obj.returnUrl = this.state.returnUrl;
    obj.reference = this.reference;

    return obj;
  }

  render() {
    return (
      <div className="row mt-3">
        <div className="col-md-6 offset-md-3">
          <h3>Adyen Drop In</h3>
        </div>
        <div className="col-md-6 offset-md-3">
          <form onSubmit={this.getPaymentMethods}>
            <div className="form-group"> 
              <label>Amount: </label>
              <input type="text"
                className="form-control"
                value={this.state.amount}
                onChange={this.handleChange}
                name="amount"
                />
            </div>
            <div className="form-group"> 
              <label>Currency: </label>
              <input type="text"
                className="form-control"
                value={this.state.currency}
                onChange={this.handleChange}
                name="currency"
                />
            </div>
            <div className="form-group"> 
              <label>Country: </label>
              <input type="text"
                className="form-control"
                value={this.state.countryCode}
                onChange={this.handleChange}
                name="countryCode"
                />
            </div>
            <div className="form-group"> 
              <label>Merchant Account: </label>
              <input type="text"
                className="form-control"
                value={this.state.merchantAccount}
                onChange={this.handleChange}
                name="merchantAccount"
                disabled
                />
            </div>
            <div className="form-group"> 
              <label>Channel: </label>
              <input type="text"
                className="form-control"
                value={this.state.channel}
                onChange={this.handleChange}
                name="description"
                disabled
                />
            </div>
            <div className="form-group"> 
              <label>Reference: </label>
              <input type="text"
                className="form-control"
                value={this.state.reference}
                onChange={this.handleChange}
                name="reference"
                />
            </div>
            <div className="form-group"> 
              <label>Return URL: </label>
              <input type="text"
                className="form-control"
                value={this.state.returnUrl}
                onChange={this.handleChange}
                name="returnUrl"
                disabled
                />
            </div>
            {this.state.error &&
              <div className="col-md-12 alert-danger mb-3">
                {this.state.error}
              </div>
            }
            <div className="form-group">
              <input type="submit" value="Get Pay Methods" className="btn btn-primary" />
            </div>
          </form>
        </div>
        <div id="dropin" className="col-md-6 offset-md-3"></div>
      </div>
    )
  }
}