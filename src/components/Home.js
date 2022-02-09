import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  Container,
  createTheme,
  ThemeProvider,
  Typography,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CardActions,
  Button,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { Redirect, useHistory, Link } from "react-router-dom";

const Home = () => {
  const theme = createTheme({
    typography: {
      fontFamily: "Outfit",
    },
  });

  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const [currentUserData, setCurrentUserData] = useState({
    email: "",
    name: "",
  });
  const history = useHistory();

  const handleLogOut = async () => {
    setError("");
    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to Log out");
    }
  };

  useEffect(() => {
    const getCurrentUserData = async () => {
      await getDoc(doc(db, "users", currentUser.uid)).then((result) => {
        setCurrentUserData(result.data());
      });
    };

    getCurrentUserData();
    // eslint-disable-next-line
  }, []);

  return currentUser ? (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <Typography variant="h4" color="inherit" align="center" sx={{ mt: 3 }}>
          Welcome Home
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Card sx={{ minWidth: 275, mt: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Your Profile
            </Typography>
            <List>
              <ListItem>
                <ListItemText>Email</ListItemText>
                <ListItemText>{currentUserData.email}</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>Name</ListItemText>
                <ListItemText>{currentUserData.name}</ListItemText>
              </ListItem>
            </List>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              to="/update-profile"
              size="small"
              variant="outlined"
              sx={{ textTransform: "none", mr: 2 }}
            >
              Update Profile
            </Button>
            <Button
              size="small"
              variant="contained"
              sx={{ textTransform: "uppercase" }}
              onClick={handleLogOut}
            >
              Log Out
            </Button>
          </CardActions>
        </Card>
      </Container>
    </ThemeProvider>
  ) : (
    <Redirect to="/login" />
  );
};

export default Home;
