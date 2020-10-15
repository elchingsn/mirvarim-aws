import React, { useState, useEffect } from "react";
import FacebookLogin from 'react-facebook-login';
import { Mutation } from '@apollo/react-components';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import gql from "graphql-tag";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Lock from "@material-ui/icons/Lock";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

import Error from "../Shared/Error";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

// login component
const Login = ({ classes, setNewUser, setLoginOpen }) => {

  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const history = useHistory();

  // handle login form submission
  const handleSubmit = async (event, tokenAuth, client) => {
    event.preventDefault();
    const res = await tokenAuth();
    if (res.data.tokenAuth.success) {
      localStorage.setItem("accessToken", res.data.tokenAuth.token);
      localStorage.setItem("refreshToken", res.data.tokenAuth.refreshToken);
      client.writeData({ data: { isLoggedIn: true } });
      if(window.location.pathname.includes('login')){
        history.push('/');
      }
    } else {
      setOpen(true)
    }

  };

  // Facebook login API
  useEffect(() => {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : '582221655699024',
        cookie     : true,                     // Enable cookies to allow the server to access the session.
        xfbml      : true,                     // Parse social plugins on this webpage.
        version    : 'v7.0'           // Use this Graph API version for this call.
      })
    
    //   window.FB.getLoginStatus(function(response) {   // See the onlogin handler
    //     statusChangeCallback(response);
    //   });
    window.FB.AppEvents.logPageView();   
    }

    console.log("Loading fb api");
    // Load the SDK asynchronously
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      //js.src = "https://connect.facebook.net/en_US/sdk.js#version=v2.2&appId=myAppId&xfbml=true&autoLogAppEvents=true"
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }, []);

  const [tokenAuth] = useMutation(LOGIN_MUTATION);
  const [register] = useMutation(REGISTER_MUTATION,
    {onCompleted ({register}) {
      console.log('data', register);
      localStorage.setItem("accessToken", register.token);
      localStorage.setItem("refreshToken", register.refreshToken);
      client.writeData({ data: { isLoggedIn: true } });
      if(window.location.pathname.includes('login')){
        history.push('/');
      }
    }});
  const client = useApolloClient();

  function handleFBLogin() {
    window.FB.getLoginStatus(function(response) {   // See the onlogin handler
      statusChangeCallback(response);
    });
  } 

  function handleFBRegistration (username, email, password) {
    console.log(username, email, password);
    tokenAuth({variables:{ username, password }}).then((res) => {
      console.log('res', res);
      if (res.data.tokenAuth.success) {
        localStorage.setItem("accessToken", res.data.tokenAuth.token);
        localStorage.setItem("refreshToken", res.data.tokenAuth.refreshToken);
        console.log('over here');
        client.writeData({ data: { isLoggedIn: true } });
      } else {
        register( {variables: {username, email, role: "1", password1: password, password2: password}});
        //window.location.reload();
      }
    })
  }

  function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    console.log('statusChangeCallback');
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
      //testAPI();  
      console.log('FB response', response);   
      window.FB.api('/me?fields=id,name,email,permissions', function(response) {
      // localStorage.setItem('facebook', "connected");
      handleFBRegistration (response.name.split(' ')[0], response.email, response.name.split(' ')[0].concat(response.id));
      console.log(response);
      // console.log('Good to see you, ' + response.email + ' '+ response.name.split(' ',1) + '.');
      });                // The current login status of the person.
    } else {
      window.FB.login(function(response) {
        // handle the response
        console.log(response);
        statusChangeCallback(response);
      }, {scope: 'public_profile, email'});
    }
  }

 
      // window.FB.api('/me?fields=id,name,email,permissions', function(response) {
      //   const fb_name = response.name.split(' ',1);
      //   const res = tokenAuth({variables: {username: fb_name, password: fb_name }});
      //   if (res.data.tokenAuth.success) { console.log('res', res)}
      // });
    
  

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Button
          color='primary'
          variant='outlined'
          className={classes.button}
          onClick={handleFBLogin}
        >
          {t("Continue with Facebook")}
        </Button>
        <Avatar className={classes.avatar}>
          <Lock />
        </Avatar>
        <Typography variant="title">{t("Login as Existing User")}</Typography>

        <Mutation mutation={LOGIN_MUTATION} variables={{ username, password }}>
          {(tokenAuth, { loading, error, called, client }) => {
            return (
              <form
                onSubmit={event => handleSubmit(event, tokenAuth, client)}
                className={classes.form}
              >
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="username">{t("Username")}</InputLabel>
                  <Input
                    id="username"
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                  />
                </FormControl>

                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="password">{t("Password")}</InputLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                  />
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading || !username.trim() || !password.trim()}
                  className={classes.submit}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
                <Button
                  onClick={() => setNewUser(true)}
                  color="secondary"
                  variant="outlined"
                  fullWidth
                >
                  {t("New user? Register here")}
                </Button>
                <br/>
                <Link to="/reset">
                  <h6 onClick={()=>setLoginOpen(false)}>{t("Forgot password?")}</h6>
                </Link>

                {/* Error Handling */}
                {error && <Error error={error} />}
              </form>
            );
          }}
        </Mutation>
      </Paper>
       {/* Login Error Dialog */}
       <Dialog
        open={open}
        disableBackdropClick={true}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          {t("Invalid credentials.")} 
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{t("Either username or password is wrong. Try again.")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setOpen(false);
              setUsername("");
              setPassword("");
            }}
          >
            {t("Login")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const LOGIN_MUTATION = gql`
  mutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      success,
      errors,
      unarchiving,
      token,
      unarchiving,
      refreshToken,
      user {
        id,
        username,
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation($username: String!, $email: String!, $role:String!, $password1: String!, $password2: String!) {
    register(username: $username, email: $email, role: $role, password1: $password1, password2: $password2) {
      success,
      errors,
      token,
      refreshToken
    }
  }
`;


const styles = theme => ({
  root: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up("md")]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing.unit * 2
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.secondary.main
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  button: {
    marginBottom: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(Login);
