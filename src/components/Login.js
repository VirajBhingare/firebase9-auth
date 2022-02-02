import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Alert, LinearProgress } from "@mui/material";
import { useHistory } from "react-router-dom";

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

const Login = () => {
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });

  const history = useHistory();

  let name, value;
  const getUserData = (event) => {
    name = event.target.name;
    value = event.target.value;
    setUserInput({ ...userInput, [name]: value });
  };

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signInWithGoogle } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(userInput.email, userInput.password);
      setLoading(false);
      history.push("/");
    } catch {
      setError("Failed to Log in");
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    await signInWithGoogle()
      .then(async (result) => {
        await setDoc(doc(db, "users", result.user.uid), {
          email: result.user.email,
          name: result.user.displayName,
        });
        setLoading(false);
        history.push("/");
      })
      .catch((error) => {
        setError("Failed to Sign In with Google. Refresh & Try Again");
        console.log(error);
      });
  };

  return (
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          {loading && (
            <Box sx={{ width: "75%", mt: 2 }}>
              <LinearProgress />
            </Box>
          )}
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
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={userInput.email}
                  onChange={getUserData}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={userInput.password}
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
              Log In
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              disabled={loading}
              onClick={handleGoogleSignIn}
              startIcon={<GoogleIcon />}
            >
              Sign In With Google
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/forgot-password">Forgot password?</Link>
              </Grid>
              <Grid item>
                <Link to="/signup">Don't have an account? Sign Up</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
};

export default Login;
