import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";//configuration object

//MSAL should be instantiated outside of the component tree to prevent it being reinstantiated on rerenders
const msalInstance = new PublicClientApplication(msalConfig);//creates new instance

//If no active account  use the first account
if (
  !msalInstance.getActiveAccount() &&//if there is no active account
  msalInstance.getAllAccounts().length > 0
) {
  msalInstance.setActiveAccount(msalInstance.getActiveAccount()[0]);//gets the first account
}

//Listen for sigin event and set active account
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {//if login success and contains the signin details
    const account = event.payload.account;
    msalInstance.setActiveAccount(account);
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App instance={msalInstance} />);
