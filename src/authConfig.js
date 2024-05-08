import { LogLevel } from "@azure/msal-browser";
export const msalConfig = {//Configuration settings of MSAL 
  auth: {
    //Mandatory
    clientId: "6b531bab-1be8-4cb9-bb40-737e16464691",//Unique Identifier  for application registered in azure
    authority: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize? ',//URL of the Azure AD tenant where your application is registered.
    redirectUri: "/",//URL where the control will be redirected after successful authentication.
    postLogoutRedirectUri: "/",//URL where the control will be redirected after logging out.
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "sessionStorage",//Authentication token will be cached into sessionStorage
    storeAuthStateInCookie: false,//authentication state will not be stored in a cookie.
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {// A boolean indicating whether the message contains personally identifiable information (PII).
          return;
        }
        switch (level) {
          case LogLevel.Error://Error: Indicates that an error occurred during the authentication process. 
            console.error(message);
            return;
          case LogLevel.Info:// Indicates potential issues or warnings
            console.error(message);
            return;
          case LogLevel.Verbose://Provides informational messages about the authentication process.
            console.error(message);
            return;
          case LogLevel.Warning://Provides detailed information for debugging purposes. 
            console.error(message);
            return;
        }
      },
    },
  },
};
//This object defines the scopes (permissions) that your application requires from the user.
export const loginRequest = {
  scopes: ['user.read'],//default api permission mentioned in the configuration
  //Application will request permission to read the user's profile information.
};
