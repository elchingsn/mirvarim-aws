import React, { useState, useCallback } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import { isNullableType } from "graphql";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { Mutation } from '@apollo/react-components';
import gql from "graphql-tag";
import Error from "./Error";


const TokenError = ({ classes }) => {
  const freshToken = localStorage.getItem("refreshToken");
  console.log(freshToken);
  const [open, setOpen] = useState(true);
  // const xxx = useCallback(() => setToken(refreshToken, freshToken),[refreshToken, freshToken]);

  const setToken = async(refreshToken, freshToken) => {
    const res = await refreshToken({variables: {freshToken}});
    localStorage.setItem("accessToken", res.data.refreshToken.token);
    console.log("inside settoken");
    setOpen(false);
  }
  const x = true;

  if (x) {
  return (
    <Mutation
        mutation={REFRESH_TOKEN_MUTATION}
        onCompleted={data => {
          console.log("mutation completed");
        }}
    >
        {(refreshToken, { loading, error }) => {
          if (error) return <Error error={error} />;
          if (open) {setToken(refreshToken, freshToken)};
          // const xxx = useCallback(() => setToken(refreshToken, freshToken),[refreshToken, freshToken]);
        }}
    </Mutation>
  );
  }

  else {return null}
};
const styles = theme => ({
  snackbar: {
    margin: theme.spacing.unit
  }
});

export default withStyles(styles)(TokenError);

const REFRESH_TOKEN_MUTATION = gql`
mutation RefreshToken($freshToken: String!) {
  refreshToken(refreshToken: $freshToken) {
    success
    errors
    token
    payload
    refreshToken
  }
}
`;