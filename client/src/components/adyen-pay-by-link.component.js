import React, { Component } from 'react';
import axios from 'axios';

export default class AdyenPayByLink extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reference: '',
      amount: '',
      currency: '',
      description: '',
      countryCode: '',
      merchantAccount: 'JamieAdyenTestECOM',
      shopperReference: '',
      shopperEmail: '',
      shopperLocale: '',
      paymentLink: '',
      error: ''
    }

    this.payLinkUrl = '/api/adyen-generate-pay-link';

    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value});
  }

  onSubmit(e) {
    e.preventDefault();
    let self = this;
    this.setState({paymentLink: ''});

    axios.post(this.payLinkUrl, this.formatJSON())
    .then((response) => {
      console.log(response.data);
      self.setState({paymentLink: response.data.url});
    })
    .catch((error) => {
      console.log(error.response);
      self.setState({error: error.response.data.message});
    });
  }

  formatJSON() {
    let obj = {};

    obj.reference = this.state.reference;
    obj.amount = {};
    obj.amount.value = this.state.amount;
    obj.amount.currency = this.state.currency;
    obj.description = this.state.description;
    obj.merchantAccount = this.state.merchantAccount;
    obj.countryCode = this.state.countryCode;

    return obj;
  }

  render() {
    return (
      <div className="row mt-3">
        <div className="col-md-6 offset-md-3">
          <h3>Adyen Pay Link API</h3>
        </div>
        <div className="col-md-6 offset-md-3">
          <form onSubmit={this.onSubmit}>
            <div className="form-group"> 
              <label>Merchant reference: </label>
              <input type="text"
                className="form-control"
                value={this.state.reference}
                onChange={this.handleChange}
                name="reference"
                />
            </div>
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
              <label>Description: </label>
              <input type="text"
                className="form-control"
                value={this.state.description}
                onChange={this.handleChange}
                name="description"
                />
            </div>
            {this.state.error &&
              <div className="col-md-12 alert-danger mb-3">
                {this.state.error}
              </div>
            }
            <div className="form-group">
              <input type="submit" value="Generate Link" className="btn btn-primary" />
            </div>
          </form>
        </div>
        {this.state.paymentLink && 
          <div className="col-md-12">
            <a target="_blank" rel="noopener noreferrer" href={this.state.paymentLink}>{this.state.paymentLink}</a>
          </div>
        }
      </div>
    )
  }
}