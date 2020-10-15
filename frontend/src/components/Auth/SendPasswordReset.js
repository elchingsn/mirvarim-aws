import React, { useState, useRef } from "react";
import { Mutation } from '@apollo/react-components';
import gql from "graphql-tag";
import { useTranslation } from 'react-i18next';

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Slide from "@material-ui/core/Slide";
import Gavel from "@material-ui/icons/Gavel";
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";
import FormHelperText from '@material-ui/core/FormHelperText';
import NativeSelect from '@material-ui/core/NativeSelect';

import Error from "../Shared/Error";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const SendPasswordReset = ({ classes, match }) => {

  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState("");
  const [snack, setSnack] = useState({
    snackOpen: false,
    snackMessage: ""
  })

  const useFocus = () => {
    const htmlElRef = useRef(null)
    const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}

    return [ htmlElRef, setFocus ] 
  }

  const [inputRef, setInputFocus] = useFocus()

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }


  const handleSubmit = (event, sendPasswordResetEmail) => {
    event.preventDefault();
    sendPasswordResetEmail();
  };

  console.log(match);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Mutation
          mutation={PASSWORD_RESET_MUTATION}
          variables={{ email }}
          onCompleted={data => {
            console.log({ data });
            if (data.sendPasswordResetEmail.success) {
              setSnack ({
                ...snack,
                snackOpen: true,
                snackMessage: t("Password reset email has been sent")
              })
            } else {
              setSnack ({
                ...snack,
                snackOpen: true,
                snackMessage: t("Verify your account. A new verification email has been sent.")
              })
            }
          }}
        >
          {(sendPasswordResetEmail, { loading, error }) => {
            return snack.snackOpen ?
              (<div> 
                <h6> {snack.snackMessage} </h6>                 
              </div>) :
              (<div>
                <Typography variant="headline"> {t("Send email")} </Typography>
                <form
                  onSubmit={event => handleSubmit(event, sendPasswordResetEmail)}
                  className={classes.form}
                >
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="email">{t("Email")}</InputLabel>
                    <Input
                      ref={inputRef} 
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
                    {loading ? t("Sending...") : t("Send")}
                  </Button>
                  {/* Error Handling */}
                  {error && <Error error={error} />}
                </form>
              </div>)
          }}
        </Mutation>
      </Paper>
      {/* // <Snackbar 
      //   open={snack.snackOpen} 
      //   autoHideDuration={3000} 
      //   //onClose={()=>setBookingDialog(false)}
      // >
      //   <Alert 
      //     //onClose={()=>setBookingDialog(false)} 
      //     severity={snack.snackType}>
      //     {snack.snackMessage}
      //   </Alert>
      // </Snackbar> */}
    </div>  
  );
};

const PASSWORD_RESET_MUTATION = gql`
  mutation($email: String!) {
    sendPasswordResetEmail(email: $email) {
      success,
      errors
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

export default withStyles(styles)(SendPasswordReset);
