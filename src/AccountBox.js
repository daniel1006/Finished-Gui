import React from 'react';

import './AccountBox.css';

function AccountBox(props) {
    if (props.authenticated) {
      return (
        <div className="AccountBox">
          <button onClick={() => props.keycloak.logout()}> Logout </button>
          <button onClick={() => props.keycloak.accountManagement()}> Account </button>
        </div>
        );
    }
    return (
      <div className="AccountBox">
        <button onClick={() => props.keycloak.login()}> Login </button>
      </div>
      );
  }

  export default AccountBox;