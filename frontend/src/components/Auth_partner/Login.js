import React, { useState, useEffect } from "react";
import { Mutation } from '@apollo/react-components';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import gql from "graphql-tag";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from '@material-ui/core/FormHelperText';
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from "@material-ui/core/InputLabel";
//import Button from "@material-ui/core/Button";
import Button from "components/Partials/Button"
import Lock from "@material-ui/icons/Lock";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

import Error from "../Shared/Error";
import { connect } from "react-redux";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

// login component
const Login = ({ classes, setNewUser, setLoginOpen }) => {

  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const history = useHistory();

  var isMobile = navigator.userAgent.match(
    /(iPad)|(iPhone)|(iPod)|(android)|(webOS)|(BlackBerry)|(IEMobile)|(Opera Mini)|(Lumia)/i
  );

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
      } else if(window.location.pathname.includes('partner')) {
        history.push(`/partner/${res.data.tokenAuth.user.id}`);
      }
    } else {
      setOpen(true)
    }

  };

  // Facebook login API
  useEffect(() => {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : '1315402405484342',
        cookie     : true,                     // Enable cookies to allow the server to access the session.
        xfbml      : true,                     // Parse social plugins on this webpage.
        version    : 'v7.0'           // Use this Graph API version for this call.
      })
    
    window.FB.AppEvents.logPageView();   
    }
    console.log("Loading fb api");
    // Load the SDK asynchronously
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }, []);

  if (window.FB && window.location.hash.includes('access_token')) {
    var hash = window.location.hash.substring(1);
    var accessString = hash.indexOf("&");
    const accessToken = hash.substring(13, accessString);
    window.FB.api('/me?fields=id,name,email,permissions', {  access_token : accessToken },function(response){
      handleFBRegistration (response.name.split(' ')[0], response.email, response.name.split(' ')[0].concat(response.id),response.id);
    });
  }
  
  const [tokenAuth] = useMutation(LOGIN_MUTATION);
  const [register] = useMutation(REGISTER_MUTATION,
    {onCompleted ({register}) {
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

  function handleFBRegistration (username, email, password, key) {
    tokenAuth({variables:{ email, password }}).then((res) => {
      if (res.data.tokenAuth.success) {
        localStorage.setItem("accessToken", res.data.tokenAuth.token);
        localStorage.setItem("refreshToken", res.data.tokenAuth.refreshToken);
        client.writeData({ data: { isLoggedIn: true } });
      } else {
        register( {variables: {username, email, role: "1", password1: password, password2: password, key}});
      }
    })
  }

  function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
      window.FB.api('/me?fields=id,name,email,permissions', function(response) {
      handleFBRegistration (response.name.split(' ')[0], response.email, response.name.split(' ')[0].concat(response.id),response.id);
      });                
    } else if(isMobile) {
      window.location.href="https://www.facebook.com/v7.0/dialog/oauth?client_id=1315402405484342&redirect_uri=http://localhost:3000/login&response_type=token&scope=public_profile,email"
    } else {
      window.FB.login(function(response) {
        statusChangeCallback(response);
      }, {scope: 'public_profile, email'});
    }
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="title">{t("Login as Existing Partner")}</Typography>
        <Mutation mutation={LOGIN_MUTATION} variables={{ email, password }}>
          {(tokenAuth, { loading, error, called, client }) => {
            return (
              <form
                onSubmit={event => handleSubmit(event, tokenAuth, client)}
                className={classes.form}
              >
                <FormHelperText style={{textAlign: "center"}}>{t("Salons and masters can access business application")}</FormHelperText>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel style={{ fontSize: "0.9rem" }} htmlFor="email">{t("Email")}</InputLabel>
                  <Input
                    id="email"
                    value={email}
                    onChange={event => setEmail(event.target.value.toLowerCase())}
                  />
                </FormControl>

                <FormControl margin="normal" required fullWidth>
                  <InputLabel style={{ fontSize: "0.9rem" }} htmlFor="password">{t("Password")}</InputLabel>
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
                  disabled={loading || !email.trim() || !password.trim()}
                  className={classes.submit}
                >
                  {loading ? "Logging in..." : t("Login")}
                </Button>
                <Button
                  onClick={() => setNewUser(true)}
                  color="secondary"
                  variant="outlined"
                  fullWidth
                >
                  {t("New Partner? Register here")}
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
          <DialogContentText>{t("Either email or password is wrong. Try again.")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setOpen(false);
              setEmail("");
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
  mutation($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      success,
      errors,
      unarchiving,
      token,
      unarchiving,
      refreshToken,
      user {
        id,
        username,
        email
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation($username:String!, $email:String!, $role:String!, $password1:String!, $password2:String!, $key:String) {
    register(username:$username, email:$email, role:$role, password1:$password1, password2:$password2, key:$key) {
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

Login.propTypes = {
  classes: PropTypes.object,
  setNewUser: PropTypes.func,
  setLoginOpen: PropTypes.func
}

export default withStyles(styles)(Login);
