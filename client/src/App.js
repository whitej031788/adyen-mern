import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import HomePage  from "./components/home-page.component";
import AdyenApiOnly  from "./components/adyen-api-only.component";
import AdyenComponents from "./components/adyen-components.component";
import AdyenDropIn from "./components/adyen-drop-in.component";
import AdyenPayByLink from "./components/adyen-pay-by-link.component";

import logo from "./logo.png";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="https://docs.adyen.com" target="_blank" rel="noopener noreferrer">
              <img src={logo} width="60" height="30" alt="Adyen" />
            </a>
            <Link to="/" className="navbar-brand">Jamie Adyen React</Link>
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/pay-by-link" className="nav-link">Pay By Link</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/drop-in" className="nav-link">Drop In</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/components" className="nav-link">Components</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/api-only" className="nav-link">API Only</Link>
                </li>
              </ul>
            </div>
          </nav>
          <br/>
          <Route path="/" exact component={HomePage} />
          <Route path="/pay-by-link" exact component={AdyenPayByLink} />
          <Route path="/drop-in" exact component={AdyenDropIn} />
          <Route path="/components" exact component={AdyenComponents} />
          <Route path="/api-only" exact component={AdyenApiOnly} />
        </div>
      </Router>
    );
  }
}

export default App;