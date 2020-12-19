import React, { useState } from "react";
import { Mutation } from '@apollo/react-components';
import gql from "graphql-tag";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
//import Button from "@material-ui/core/Button";
import Button from "components/Partials/Button"
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";
import FormHelperText from '@material-ui/core/FormHelperText';
import NativeSelect from '@material-ui/core/NativeSelect';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import Error from "../Shared/Error";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const Register = ({ classes, setNewUser }) => {

  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [failureOpen, setFailureOpen] = useState({
    open: false,
    message: "",
    label: ""
  });
  const [role, setRole] = useState("1");
  const [err, setErr] = useState({});

  const handleSubmit = (event, register) => {
    event.preventDefault();
    register();
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {/* <Avatar className={classes.avatar}>
          <VpnKeyIcon />
        </Avatar>*/}
        <Typography variant="headline">{t("Register")}</Typography> 

        <Mutation
          mutation={REGISTER_MUTATION}
          variables={{ username, email, role, password1, password2 }}
          onCompleted={data => {
            if (data.register.success) {
              setSuccessOpen(true) 
            }
             else {
            //   const err = data.register.errors.map(e => e.map(e => e.message))
               //console.log('err', data.register.errors);
              setErr(data.register.errors);
            //   setFailureOpen({ 
            //     ...failureOpen, 
            //     open: false, 
            //     message: data.register.errors.map(e => e.map(e => e.message))})
            }
          }}
        >
          {(register, { loading, error }) => {
            return (
              <form
                onSubmit={event => handleSubmit(event, register)}
                className={classes.form}
              >
                <FormControl margin="dense" required fullWidth>
                  <NativeSelect
                    value={role}
                    style={{ fontSize: "0.9rem" }}
                    onChange={event => {
                      setRole(event.target.value);
                    }}
                    name="role"
                    className={classes.selectEmpty}
                    inputProps={{ 'aria-label': 'role' }}
                  >
                    <option value="1">{t("User")}</option>
                    <option value="2">{t("Freelancer")}</option>
                    <option value="3">{t("Salon")}</option>
                  </NativeSelect>
                  <FormHelperText>{t("Register as User or Salon")}</FormHelperText>
                </FormControl>
                <FormControl margin="dense" required fullWidth>
                  <InputLabel style={{ fontSize: "0.9rem" }} htmlFor="username">{t("Username")}</InputLabel>
                  <Input
                    id="username"
                    onChange={event => setUsername(event.target.value)}
                  />
                  <h6 className={classes.error}>{err["username"]&&err["username"][0].message}</h6>                  
                </FormControl>
                <FormControl margin="dense" required fullWidth>
                  <InputLabel style={{ fontSize: "0.9rem" }} htmlFor="email">{t("Email")}</InputLabel>
                  <Input
                    id="email"
                    type="email"
                    onChange={event => setEmail(event.target.value)}
                  />
                  <h6 className={classes.error}>{err["email"]&&err["email"][0].message}</h6>
                </FormControl>
                <FormControl margin="dense" required fullWidth>
                  <InputLabel style={{ fontSize: "0.9rem" }} htmlFor="password1">{t("Password")}</InputLabel>
                  <Input
                    id="password1"
                    type={showPassword ? 'text' : 'password'}
                    onChange={event => setPassword1(event.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={(event) => event.preventDefault()}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <h6 className={classes.error}>{err["password1"]&&err["password1"][0].message}</h6>
                </FormControl>
                <FormControl margin="dense" required fullWidth>
                  <InputLabel style={{ fontSize: "0.9rem" }} htmlFor="password2">{t("Confirm Password")}</InputLabel>
                  <Input
                    id="password2"
                    type={showPassword ? 'text' : 'password'}
                    onChange={event => setPassword2(event.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={(event) => event.preventDefault()}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }                    
                  />
                  <h6 className={classes.error}>{err["password2"]&&err["password2"][0].message}</h6>
                </FormControl>
                <h6 className={classes.error}>{err["nonFieldErrors"]&&err["nonFieldErrors"][0].message}</h6>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={
                    loading ||
                    !username.trim() ||
                    !email.trim() ||
                    !password1.trim() ||
                    !password2.trim()
                  }
                  className={classes.submit}
                >
                  {loading ? "Registering..." : "Register"}
                </Button>
                <Button
                  onClick={() => setNewUser(false)}
                  color="secondary"
                  variant="outlined"
                  fullWidth
                >
                  {t("Existing user? Log in here")}
                </Button>

                {/* Error Handling */}
                {error && <Error error={error} />}
              </form>
            );
          }}
        </Mutation>
      </Paper>

      {/* Success Dialog */}
      <Dialog
        open={successOpen}
        disableBackdropClick={true}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <VerifiedUserTwoTone className={classes.icon} />
          {t("New Account")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{t("User successfully created!")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setNewUser(false)}
          >
            {t("Login")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={failureOpen.open}
        disableBackdropClick={true}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <VerifiedUserTwoTone className={classes.icon} />
          {t("New Account")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{t("User successfully created!")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setNewUser(false)}
          >
            {t("Login")}
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

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

// const REGISTER_MUTATION = gql`
//   mutation($username: String!, $email: String!, $password: String!) {
//     createUser(username: $username, email: $email, password: $password) {
//       user {
//         username
//         email
//       }
//     }
//   }
// `;

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
    marginTop: theme.spacing.unit*2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing.unit*2
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.openTitle
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%",
    marginTop: "10px"
  },
  submit: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  icon: {
    padding: "0px 2px 2px 0px",
    verticalAlign: "middle",
    color: "green"
  },
  error: {
    color: "red"
  }
});

Register.propTypes = {
  classes: PropTypes.object,
  setNewUser: PropTypes.func
}

export default withStyles(styles)(Register);
