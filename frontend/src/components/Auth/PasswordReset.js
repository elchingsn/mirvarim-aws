import React, { useState, useRef } from "react";
import { Mutation } from '@apollo/react-components';
import gql from "graphql-tag";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Gavel from "@material-ui/icons/Gavel";
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";
import FormHelperText from '@material-ui/core/FormHelperText';
import NativeSelect from '@material-ui/core/NativeSelect';

import Error from "../Shared/Error";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const PasswordReset = ({ classes, match }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("1");

  const useFocus = () => {
    const htmlElRef = useRef(null)
    const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}

    return [ htmlElRef, setFocus ] 
}

const [inputRef, setInputFocus] = useFocus()

  const handleSubmit = (event, register) => {
    event.preventDefault();
    register();
  };

  console.log(match);

  return (
    match&&match.params.token ?
    (<div className={classes.root}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <Gavel />
        </Avatar>
        <Typography variant="headline">Register</Typography>

        <Mutation
          mutation={REGISTER_MUTATION}
          variables={{ username, email, role, password1, password2 }}
          onCompleted={data => {
            console.log({ data });
            setOpen(true);
          }}
        >
          {(register, { loading, error }) => {
            return (
              <form
                onSubmit={event => handleSubmit(event, register)}
                className={classes.form}
              >
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="password1">Password</InputLabel>
                  <Input
                    id="password1"
                    type="password"
                    onChange={event => setPassword1(event.target.value)}
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="password2">Confirm Password</InputLabel>
                  <Input
                    id="password2"
                    type="password"
                    onChange={event => setPassword2(event.target.value)}
                  />
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
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
                {/* Error Handling */}
                {error && <Error error={error} />}
              </form> 
            );
          }}
        </Mutation>
      </Paper>

      {/* Success Dialog */}
      <Dialog
        open={open}
        disableBackdropClick={true}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <VerifiedUserTwoTone className={classes.icon} />
          New Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText>User successfully created!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>)
  :(<div className={classes.root}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <Gavel />
        </Avatar>
        <Typography variant="headline"> Send email </Typography>

        <Mutation
          mutation={REGISTER_MUTATION}
          variables={{ username, email, role, password1, password2 }}
          onCompleted={data => {
            console.log({ data });
            setOpen(true);
          }}
        >
          {(register, { loading, error }) => {
            return (
              <form
                onSubmit={event => handleSubmit(event, register)}
                className={classes.form}
              >
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <Input
                    id="email"
                    type="email"
                    onChange={event => setEmail(event.target.value)}
                  />
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  disabled={
                    loading ||
                    !email.trim()
                  }
                  className={classes.submit}
                >
                  {loading ? "Registering..." : "Register"}
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
        open={open}
        disableBackdropClick={true}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <VerifiedUserTwoTone className={classes.icon} />
          New Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText>User successfully created!</DialogContentText>
        </DialogContent>
      </Dialog>
    </div>)
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
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing.unit * 2
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
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  icon: {
    padding: "0px 2px 2px 0px",
    verticalAlign: "middle",
    color: "green"
  }
});

export default withStyles(styles)(PasswordReset);
