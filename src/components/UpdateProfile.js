import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, Redirect, useHistory } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Alert } from "@mui/material";

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link to="/">Viraj Bhingare</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const theme = createTheme({
  typography: {
    fontFamily: "Outfit",
  },
});

const UpdateProfile = () => {
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { currentUser, updateEmail, updatePassword } = useAuth();

  const history = useHistory();

  let name, value;
  const getUserData = (event) => {
    name = event.target.name;
    value = event.target.value;
    setUserInput({ ...userInput, [name]: value });
  };

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (userInput.password !== userInput.confirmPassword) {
      return setError("Passwords do not match!");
    }

    const promises = [];
    setLoading(true);
    setError("");
    if (userInput.email !== currentUser.email) {
      promises.push(updateEmail(userInput.email));
    }
    if (userInput.password !== currentUser.password) {
      promises.push(updatePassword(userInput.password));
    }

    Promise.all(promises)
      .then(() => {
        history.push("/");
      })
      .catch(() => {
        setError("Failed to update your account");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return currentUser ? (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <AccountCircleIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Update Profile
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={getUserData}
                  defaultValue={currentUser.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  placeholder="Leave blank to keep the same"
                  autoComplete="new-password"
                  value={userInput.password}
                  onChange={getUserData}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  placeholder="Leave blank to keep the same"
                  autoComplete="new-password"
                  value={userInput.confirmPassword}
                  onChange={getUserData}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Update
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/">Cancel</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  ) : (
    <Redirect to="/login" />
  );
};

export default UpdateProfile;
