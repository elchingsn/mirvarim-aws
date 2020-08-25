import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { ApolloConsumer, Query } from "@apollo/react-components";
import gql from "graphql-tag";
import Loading from "../Shared/Loading";
import Error from "../Shared/Error";
import Auth from "../Auth";

import { useTranslation } from 'react-i18next';
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Button from 'components/Partials/Button.js';
import GridContainer from "components/Partials/GridContainer.js";
import GridItem from "components/Partials/GridItem.js";

// @material-ui/icons
import HomeIcon from '@material-ui/icons/Home';
import style from "assets/jss/footerMenuStyle.js";
import Signout from "../Auth/Signout";

const useStyles = makeStyles(style);

const FooterMenu = (props) => {
  const classes = useStyles();

  return(
    <div
      className={classNames(
        classes.socialLine,
        classes.textCenter,
        classes.dark,
        // classes.bigIcons,
        classes.stickyFooter
      )}
    >
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={2} sm={2} md={2} className={classes.border}>
            <Button
              color="white"
              justIcon
              simple
              href="#pablo"
              onClick={e => e.preventDefault()}
            >
              <Link style={{color:"white"}} to="/">
              <i class="fas fa-home"></i>
              </Link>
              {/* 
               <HomeIcon fontSize="large" />
               <h6 style={{margin:"0"}}> Home </h6> 
              */}
            </Button>
          </GridItem>
          <GridItem xs={2} sm={2} md={2} className={classes.border}>
            <Button
              color="white"
              justIcon
              simple
              href="#pablo"
              onClick={e => e.preventDefault()}
            >
              <Link style={{color:"white"}} to="/">
              <i class="fas fa-user" ></i>
              </Link>
            </Button>
          </GridItem>
          <GridItem xs={2} sm={2} md={2} className={classes.border}>
            <Button
              color="white"
              justIcon
              simple
              href="#pablo"
              onClick={e => e.preventDefault()}
            >
              <Link style={{color:"white"}} to="/">
              <i class="fas fa-tags" ></i>
              </Link>
            </Button>
          </GridItem>
          <GridItem xs={2} sm={2} md={2} className={classes.border}>
            <Button
              color="white"
              justIcon
              simple
              href="#pablo"
              onClick={e => e.preventDefault()}
            >
              <Link style={{color:"white"}} to="/">
              <i class="fas fa-envelope" ></i>
              </Link>
            </Button>
          </GridItem>
          <GridItem xs={2} sm={2} md={2} className={classes.border}>
            <Button
              color="white"
              justIcon
              simple
              href="#pablo"
              onClick={e => e.preventDefault()}
            >
              <Link style={{color:"white"}} to="/">
              <i class="fab fa-facebook" ></i>
              </Link>
            </Button>
          </GridItem>
          <GridItem xs={2} sm={2} md={2} className={classes.border}>
            <Button
              color="white"
              justIcon
              simple
              href="#pablo"
              onClick={e => e.preventDefault()}
            >
              <Link style={{color:"white"}} to="/">
              <i class="fab fa-instagram" ></i>
              </Link>
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}

export default FooterMenu;