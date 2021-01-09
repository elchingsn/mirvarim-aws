import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
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
import style from "assets/jss/footerMenuStyle.js";

const useStyles = makeStyles(style);

const FooterMenu = (props) => {
  const classes = useStyles();
  const {currentUser} = props;
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
  };

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
              style={{marginTop: "0px", marginBottom: "0px", paddingBottom: "0px" }}
              onClick={e => e.preventDefault()}
            >
              <Link style={{color:"white"}} to="/">
              <i className="fas fa-home"></i>
              </Link>
              {/* 
               <HomeIcon fontSize="large" />
               <h6 style={{margin:"0"}}> Home </h6> 
              */}
            </Button>
            <h5 style={{marginTop: "0px", marginBottom: "0px"}}>{t("Home")}</h5>
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
              style={{marginTop: "0px", marginBottom: "0px", paddingBottom: "0px" }}
              onClick={handleSearchOpen}
            >
              <i className="fas fa-search" ></i>
              {/* <Link style={{color:"white"}} to="/salon">
              <i class="fas fa-search" ></i>
              </Link> */}
            </Button>
            <h5 style={{marginTop: "0px", marginBottom: "0px"}}>{t("Search")}</h5>
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
            {currentUser ?
              (<div>
                {(currentUser.role === "A_3" || currentUser.role === "A_2") ? 
                 (<div>
                  <Button
                    color="white"
                    justIcon
                    simple
                    style={{marginTop: "0px", marginBottom: "0px", paddingBottom: "0px" }}
                    onClick={e => e.preventDefault()}
                  >
                    <Link style={{color:"white"}} to={`/partner/${currentUser.id}`}>
                    <i className="fas fa-user" ></i>
                    </Link>
                  </Button> 
                  <h5 style={{marginTop: "0px", marginBottom: "0px"}}>{t("My salon")}</h5>
                  </div>) 
                 :(<div>
                  <Button
                    color="white"
                    justIcon
                    simple
                    style={{marginTop: "0px", marginBottom: "0px", paddingBottom: "0px" }}
                    onClick={e => e.preventDefault()}
                  >
                    <Link style={{color:"white"}} to={`/profile/${currentUser.id}`}>
                    <i className="fas fa-user" ></i>
                    </Link>
                  </Button> 
                  <h5 style={{marginTop: "0px", marginBottom: "0px"}}>{t("Account")}</h5>
                  </div>)}
                </div>)
              :(<div>
                <Button
                  color="white"
                  justIcon
                  simple
                  style={{marginTop: "0px", marginBottom: "0px", paddingBottom: "0px" }}
                  onClick={e => e.preventDefault()}
                >
                  <Link style={{color:"white"}} to={`/login`}>
                  <i className="fas fa-user" ></i>
                  </Link>
                </Button> 
                <h5 style={{marginTop: "0px", marginBottom: "0px"}}>{t("Account")}</h5>
                </div>
              // <div>
              //   <Button
              //     color="white"
              //     justIcon
              //     simple
              //     style={{marginTop: "0px", marginBottom: "0px", paddingBottom: "0px" }}
              //     onClick={() => setOpen(true)} 
              //     >
              //     <i className="fas fa-user" ></i>
              //   </Button> 
              //   <h5 style={{marginTop: "0px", marginBottom: "0px"}}>{t("Account")}</h5>
              //   <Dialog
              //     open={open}
              //     onClose={() => setOpen(false)}
              //   >
              //     <Auth/>
              //   </Dialog>
              // </div>
            )}
          </GridItem>
          <GridItem xs={3} sm={3} md={3} className={classes.border}>
            <Button
              color="white"
              justIcon
              simple
              style={{marginTop: "0px", marginBottom: "0px", paddingBottom: "0px" }}
              onClick={e => e.preventDefault()}
            >
              <Link style={{color:"white"}} to="/contact">
              <i className="fas fa-envelope" ></i>
              </Link>
            </Button>
            <h5 style={{marginTop: "0px", marginBottom: "0px"}}>{t("Contact")}</h5>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}

export default withRouter(FooterMenu);