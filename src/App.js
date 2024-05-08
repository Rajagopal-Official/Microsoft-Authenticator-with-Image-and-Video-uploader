import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Button, Grid } from "@mui/material";
import ImageCarouselCard from "./Components/ImageCarouselCard";
import VideoCard from "./Components/VideoCard";
import "./App.css";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  MsalProvider,
} from "@azure/msal-react";
import { loginRequest } from "./authConfig";

const theme = createTheme({
  palette: {
    primary: {
      main: "#536dfe",
    },
    secondary: {
      main: "#ff4081",
    },
    background: {
      default: "#f0f2f5",
    },
  },
});

const WrappedView = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const handleRedirect = () => {
    instance
      .loginRedirect({ ...loginRequest, prompt: "create" })
      .catch((error) => console.log(error));
  };
  const handleLogout = () => {
    instance.logout();
  };

  return (
    <div className="App">
      <AuthenticatedTemplate>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          bgcolor={theme.palette.background.default}
          padding='20px'
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between", // Align items to the ends
              width: "80%",
            }}
          >
            <Grid item xs={12} md={6}>
              <ImageCarouselCard />
            </Grid>
            <Grid item xs={12} md={6}>
              <VideoCard />
            </Grid>
            <Button
              sx={{position:'absolute',top:20,right:20, height: "30px", width: "30px" }}
              variant="contained"
              color="primary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Box>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Button variant="contained" color="secondary" onClick={handleRedirect}>
          SignUp
        </Button>
      </UnauthenticatedTemplate>
    </div>
  );
};

const App = ({ instance }) => {
  return (
    <MsalProvider instance={instance}>
      <ThemeProvider theme={theme}>
        <WrappedView />
      </ThemeProvider>
    </MsalProvider>
  );
};

export default App;
