import React, { useState } from "react";
import { Mutation } from '@apollo/react-components';
import gql from "graphql-tag";
import {Link} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

const Activate = ({ classes, match }) => {

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  const token = window.location.pathname.split('/').slice(-1)[0];

  return (
    <div className={classes.root}>
        <Mutation
          mutation={VERIFY_MUTATION}
          variables={{ token }}
          // onCompleted={data => {
          //   console.log({ data });
          // }}
        >
          {(verifyAccount, { data, loading, error }) => {
            return <Verify verifyAccount={verifyAccount} />
            }}
        </Mutation>
    </div>
  );
};

const Verify = ({verifyAccount}) => {

  const { t } = useTranslation();
  const [vdata, setVdata] = useState({})

  React.useEffect(() => {
    verifyAccount().then((res) => setVdata(res.data.verifyAccount));
  }, []);

  return (
    <div>
    {vdata&&vdata.success 
    ? (<Typography>{t("Account successfully verified!")}</Typography>) 
    : (vdata&&vdata.errors ? (<Typography>{vdata.errors.nonFieldErrors[0].message}</Typography>) : (<div>{t("Please try again")}</div>))}
    <Link to="/reset">
      {t("Change password")}
    </Link>
    <br/>
    <Link to="/">
      {t("Return to the main page")}
    </Link>
    </div>
  )

}

const VERIFY_MUTATION = gql`
  mutation($token: String!) {
    verifyAccount (token: $token) {
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

Activate.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object
}

Verify.propTypes = {
  verifyAccount: PropTypes.func
}

export default withStyles(styles)(Activate);
