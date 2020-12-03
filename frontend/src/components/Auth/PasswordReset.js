import React, { useState, useRef } from "react";
import { Mutation } from '@apollo/react-components';
import gql from "graphql-tag";
import {Link} from "react-router-dom";
import { useTranslation } from 'react-i18next';

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
//import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import PropTypes from 'prop-types';
import Error from "../Shared/Error";

const PasswordReset = ({ classes, match }) => {

  const { t } = useTranslation();

  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [err, setErr] = useState({});
  const [snack, setSnack] = useState({
    snackOpen: false,
    snackMessage: ""
  })

  const token = match.params.token;

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

  return (
    // match&&match.params.token ?
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="headline">{t("Reset password")}</Typography>
        <Mutation
          mutation={PASSWORD_RESET_MUTATION}
          variables={{ token, newPassword1, newPassword2 }}
          onCompleted={data => {
            //console.log({ data });
            if (data.passwordReset.success) {
              setSnack ({
                ...snack,
                snackOpen: true,
                snackMessage: t("Password has been successfully changed")
              })
            } else {
              setErr(data.passwordReset.errors);
            }            
          }}
        >
          {(register, { loading, error }) => {
            return snack.snackOpen ?
            (<div> 
              <h6> {snack.snackMessage} </h6>                 
                <Link to="/">
                  {t("Return to the main page")}
                </Link>
              </div>) :
            (<form
                onSubmit={event => handleSubmit(event, register)}
                className={classes.form}
              >
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="password1">{t("Password")}</InputLabel>
                  <Input
                    id="password1"
                    type="password"
                    onChange={event => setNewPassword1(event.target.value)}
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="password2">{t("Confirm Password")}</InputLabel>
                  <Input
                    id="password2"
                    type="password"
                    onChange={event => setNewPassword2(event.target.value)}
                  />
                  <h6 className={classes.error}>{err["newPassword2"]&&err["newPassword2"][0].message}</h6>
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  disabled={
                    loading ||
                    !newPassword1.trim() ||
                    !newPassword2.trim()
                  }
                  className={classes.submit}
                >
                  {loading ? t("Submitting...") : t("Submit")}
                </Button>
                <h6 className={classes.error}>{err["nonFieldErrors"]&&err["nonFieldErrors"][0].message}</h6>
                {/* Error Handling */}
                {error && <Error error={error} />}
              </form> )
          }}
        </Mutation>
      </Paper>
    </div>
  );
};

const PASSWORD_RESET_MUTATION = gql`
  mutation ($token: String!, $newPassword1: String!, $newPassword2: String!) {
    passwordReset(token: $token,newPassword1: $newPassword1, newPassword2: $newPassword2){
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
  },
  error: {
    color: "red"
  }
});

PasswordReset.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object
}

export default withStyles(styles)(PasswordReset);
