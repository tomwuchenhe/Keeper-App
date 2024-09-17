import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import {useState} from "react"
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { baseAPI } from './App';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Keeper By Chenheee
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

async function passData(data) {
    const response = await baseAPI.post("/api/signUp/submit", data)
    return response
}

function TypeAlert(props) {
    if (props.data !== '') {
        if (props.data.status) {
            const message = props.data.data.message
            if (message === "Sign Up Success")
                return <Alert severity="success">{message}</Alert>
            return <Alert severity="info">{message}</Alert>
        }
    }
}

export default function SignUp() {
    const nav = useNavigate()
    const [message, setMessage] = useState("")
  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget);
    //data is formdata TODO
    const form_data = {
      uname: data.get('uname'),
      password: data.get('password')
    }
    const res = await passData(form_data)
    setMessage(res)
  };

  React.useEffect(() => {
    if (message != ''){
        if (message.data.message === "Sign Up Success") {
            setTimeout(() => {
                nav('/');
            }, 1500);
            }
        }
  }
  , [message, nav])


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <br />
          <TypeAlert data = {message} />
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Username"
                  name="uname"
                  autoComplete="email"
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
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}