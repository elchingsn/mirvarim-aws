import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { ApolloConsumer, Query } from "@apollo/react-components";
import gql from "graphql-tag";
import Loading from "../Shared/Loading";
import Error from "../Shared/Error";

import { useTranslation } from 'react-i18next';
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Button from 'components/Partials/Button.js';
import GridContainer from "components/Partials/GridContainer.js";
import GridItem from "components/Partials/GridItem.js";
import SearchSalons from "components/Partials/SearchSalons";
import Dialog from '@material-ui/core/Dialog';
import Auth from "components/Auth"
import Card from "components/Partials/Card.js";
import CardBody from "components/Partials/CardBody.js";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

// @material-ui/icons
import HomeIcon from '@material-ui/icons/Home';
import style from "assets/jss/footerMenuStyle.js";
import Signout from "../Auth/Signout";

const useStyles = makeStyles(style);

const FooterMenu = (props) => {
  const classes = useStyles();
  const {currentUser} = props;
  const [open, setOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  console.log("searchOpen", searchOpen)

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  console.log(currentUser);

  if(props.location.pathname.match(/partner/)){
    return (null);
  }

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
          {/* Home button */}
          <GridItem xs={3} sm={3} md={3} className={classes.border}>
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
          {/* <GridItem xs={3} sm={3} md={3} className={classes.border}>
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
          </GridItem> */}
          <GridItem xs={3} sm={3} md={3} className={classes.border}>
            <Dialog
              fullScreen
              open={searchOpen}
              onClose={handleSearchClose}
              //aria-labelledby="alert-dialog-title"
              //aria-describedby="alert-dialog-description"
            >
            <Card raised className={classes.card}>
              <CardBody formHorizontal>
                <IconButton
                  color="inherit"
                  onClick={handleSearchClose}
                  style={{float:"right"}}
                >
                  <ExitToAppIcon />
                </IconButton>
                <br/>
                <br/>
                <SearchSalons 
                  state = {setSearchResults}
                  setSearchOpen = {setSearchOpen} /> 
              </CardBody>
            </Card>
            </Dialog>
            <Button
              color="white"
              justIcon
              simple
              onClick={handleSearchOpen}
            >
              <i class="fas fa-search" ></i>
              {/* <Link style={{color:"white"}} to="/salon">
              <i class="fas fa-search" ></i>
              </Link> */}
            </Button>
          </GridItem>
          {/* <GridItem xs={2} sm={2} md={2} className={classes.border}>
            <Button
              color="white"
              justIcon
              simple
              href="#pablo"
              onClick={e => e.preventDefault()}
            >
              <Link style={{color:"white"}} to="/">
              <i class="fas fa-heart" ></i>
              </Link>
            </Button>
          </GridItem> */}
          {/* <GridItem xs={2} sm={2} md={2} className={classes.border}>
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
          </GridItem> */}
          {/* Profile button */}
          <GridItem xs={3} sm={3} md={3} className={classes.border}>
            {currentUser
            ? (
            <Button
              color="white"
              justIcon
              simple
              href="#pablo"
              onClick={e => e.preventDefault()}
            >
              <Link style={{color:"white"}} to={`/profile/${currentUser.id}`}>
              <i class="fas fa-user" ></i>
              </Link>
            </Button> )
            :(<div>
              <Button
                color="white"
                justIcon
                simple
                href="#pablo"
                onClick={() => setOpen(true)} 
                >
                <i class="fas fa-user" ></i>
              </Button> 
              <Dialog
                open={open}
                onClose={() => setOpen(false)}
              >
                <Auth/>
              </Dialog>
            </div>
          )}
          </GridItem>
          <GridItem xs={3} sm={3} md={3} className={classes.border}>
            <Button
              color="white"
              justIcon
              simple
              href="#pablo"
              onClick={e => e.preventDefault()}
            >
              <Link style={{color:"white"}} to="/contact">
              <i class="fas fa-envelope" ></i>
              </Link>
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}

export default withRouter(FooterMenu);