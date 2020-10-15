import React from "react";
import { ApolloConsumer, useQuery } from "@apollo/react-hooks";
import { useTranslation } from 'react-i18next';

import withStyles from "@material-ui/core/styles/withStyles";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

export const handleSignout = client => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      client.writeData({ data: { isLoggedIn: false } });
      // console.log("Signed out user", client);
      //client.clearStore()
};

const Signout = ({ classes }) => {
  const { t, i18n } = useTranslation();
  return (
    <ApolloConsumer>
      {client => (
        <Button onClick={() => handleSignout(client)}>
          <Typography
            variant="body"
            className={classes.buttonText}
            color="secondary"
          >
            {t("Signout")}
          </Typography>
          <ExitToApp className={classes.buttonIcon} color="secondary" />
        </Button>
      )}
    </ApolloConsumer>
  );
};

const styles = {
  root: {
    cursor: "pointer",
    display: "flex"
  },
  buttonIcon: {
    marginLeft: "5px"
  }
};

export default withStyles(styles)(Signout);
