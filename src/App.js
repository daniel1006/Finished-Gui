import React, { useState } from "react";
import Keycloak from "keycloak-js";
import AccountBox from './AccountBox';
import MessageBox from './MessageBox';

import './App.css';

let keycloak = new Keycloak({url: 'https://login.t2data.com/auth/spa', realm: 'kramfors', clientId: 'spa'});
var serviceUrl = 'https://lb.t2data.com/simple/v1'

function App() {
  const [authenticated, authenticate] = useState(false);
  const [response, setResponse] = useState('');
  const [error, hasError] = useState(false);

  keycloak.init({ onLoad: 'check-sso', checkLoginIframeInterval: 1 }).then(() => {
    if (keycloak.authenticated) {
      authenticate(true);
    } else {
      authenticate(false);
    }
  });

  keycloak.onAuthLogout = () => authenticate(false);

  const request = (endpoint) => {
    const options = {
      method: 'GET'
    }

    if (keycloak.authenticated) {
      options.headers = {Authorization: `Bearer ${keycloak.token}`};
    }
    const url = `${serviceUrl}/${endpoint}`;
    console.log({url})
    console.log({options})
    fetch(url, options).then((response) => {
      if (response.status === 200) {
        response.text().then((text) => {
          setResponse('Message: ' + text);
        });
        hasError(false);
      } else if (response.status === 0) {
        setResponse('Request failed');
        hasError(true);
      } else {
        setResponse(response.status + ' ' + response.statusText);
        hasError(true);
      }
    });
  }

  return (
      <div className="App">
        <div className="Content">
        <AccountBox authenticated={authenticated} keycloak={keycloak}/>
        <div className="L1" /> <div className="L2" />
          <div className="Box"> 
            <button className="button1" onClick={() => request('public')}>Invoke Public </button>
            <button className="button1" onClick={() => request('secure')}>Invoke Secure</button>
            <button className="button1" onClick={() => request('admin')}>Invoke Admin</button>
            <MessageBox message={response} error={error}/>
            <a className="link1" href="https://lb.t2data.com/simple/v1/ui">Backend</a>
            <a className="link2" href="https://login.microsoftonline.com/logout.srf">Azure logout</a>
            </div>
            </div>
        </div>

  );
}

export default App;
