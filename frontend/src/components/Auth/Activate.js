import React, { useState } from "react";
import { Mutation } from '@apollo/react-components';
import gql from "graphql-tag";
import {Link} from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";

import Error from "../Shared/Error";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const Activate = ({ classes, match }) => {

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });

  const token = window.location.pathname.split('/').slice(-1)[0];
  console.log('token', token)
  console.log('match', match)

  return (
    <div className={classes.root}>
        <Mutation
          mutation={VERIFY_MUTATION}
          variables={{ token }}
          onCompleted={data => {
            console.log({ data });
          }}
        >
          {(verifyAccount, { data, loading, error }) => {
            return <Verify verifyAccount={verifyAccount} />
            }}
        </Mutation>
    </div>
  );
};

const Verify = ({verifyAccount}) => {

  const [vdata, setVdata] = useState({})

  React.useEffect(() => {
    verifyAccount().then((res) => setVdata(res.data.verifyAccount));
  }, []);

  console.log(vdata);

  return (
    <div>
    {vdata&&vdata.success 
    ? (<Typography>Account successfully verified!</Typography>) 
    : (vdata&&vdata.errors ? (<Typography>{vdata.errors.nonFieldErrors[0].message}</Typography>) : (<div>Please try again</div>))}
    <Link to="/">
      Return to the main page.
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

export default withStyles(styles)(Activate);
