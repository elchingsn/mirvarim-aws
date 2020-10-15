import React, { useState, useEffect } from "react";
import { withRouter } from 'react-router-dom';
import { ApolloConsumer, Query } from "@apollo/react-components";
import gql from "graphql-tag";
import Loading from "../Shared/Loading";
import Error from "../Shared/Error";
import Auth from "../Auth";

import { useTranslation } from 'react-i18next';

import PropTypes from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Icon from "@material-ui/core/Icon";

import HoverDropdown from "../../components/Partials/HoverDropdown";
import CreateSalon from "../../components/Salon/CreateSalon.js";

import { Link } from "react-router-dom";
import Signout from "../Auth/Signout";

import aze_flag from "assets/img/aze.png"
import ru_flag from "assets/img/ru.png"
import en_flag from "assets/img/eng.png"

import styles from "../../assets/jss/navbarStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const smoothScroll = (e, target) => {
    if (window.location.pathname === "/sections") {
      var isMobile = navigator.userAgent.match(
        /(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i
      );
      if (isMobile) {
        // if we are on mobile device the scroll into view will be managed by the browser
      } else {
        e.preventDefault();
        var targetScroll = document.getElementById(target);
        scrollGo(document.documentElement, targetScroll.offsetTop, 1250);
      }
    }
  };
  const scrollGo = (element, to, duration) => {
    var start = element.scrollTop,
      change = to - start,
      currentTime = 0,
      increment = 20;

    var animateScroll = function() {
      currentTime += increment;
      var val = easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  };
  var onClickSections = {};

  const { currentUser } = props;
  const classes = useStyles();
  const [loginOpen, setLoginOpen] = useState(false);
  const [dashboard, setDashboard] = useState(false);
  // const [form, setForm] = useState(false);
  // const [fbUser, setFbUser] = useState("");
  const [flag, setFlag] = useState(localStorage.getItem("i18nextLng"));

  const { t, i18n } = useTranslation();

  const handleLoginOpen = () => {
    setLoginOpen(true);
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  const handleDashboardOpen = () => {
    setDashboard(true);
  };

  const handleDashboardClose = () => {
    setDashboard(false);
  };

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    setFlag(code);
  }

  return (
      <div className={classes.collapse}>      
        {/* Auth User Info */}
        {currentUser
        ? (<div>    
          <List className={classes.list + " " + classes.mlAuto}>
          <ListItem className={classes.listItem}>
              <FormControl variant="outlined" className={classes.formControl}>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={flag}
                  onChange={(event) => changeLang(event.target.value)}
                  label="flag"
                >
                  <MenuItem value="aze">
                    <img src={aze_flag} style={{width: 30, height: 30}}/>
                  </MenuItem>
                  <MenuItem value="ru">
                    <img src={ru_flag} style={{width: 30, height: 30}}/>
                  </MenuItem>
                  <MenuItem value="en">
                    <img src={en_flag} style={{width: 30, height: 30}}/>
                  </MenuItem>
                </Select>
              </FormControl>
            </ListItem> 
            {currentUser.role === "A_3" ? 
              (<ListItem className={classes.listItem}>
                {/* Below commented code yields purple text */}
                {/* <Link to={"/partner"} className={classes.grow}>
                <Button className={classes.listItem} variant="outlined"
                  onClick={(e)=> e.preventDefault}>
                  <h5 style={{margin:"5px"}}>List your salon</h5>
                </Button>
                </Link> */}
                <Link to={`/partner/${currentUser.id}`}>
                <Button className={classes.username} size="small" variant="outlined"
                  onClick={(e)=> e.preventDefault}>
                  List your salon
                </Button>
                </Link>
                </ListItem>) 
              :(<ListItem className={classes.listItem}>
                <Button className={classes.username} size="small" variant="outlined"
                  onClick={handleDashboardOpen}>
                  List your salon
                </Button>
                </ListItem>
              )}
            {/* <Link to={`/profile/${currentUser.id}`} className={classes.grow}>
              <Typography variant="headline" className={classes.username} noWrap>
              {currentUser.username} 
              </Typography> 
            </Link> */}
            <ListItem className={classes.listItem}>
            <Link to={`/profile/${currentUser.id}`} className={classes.grow}>
              <Button className={classes.username} size="small" 
                onClick={(e)=> e.preventDefault}>
                {currentUser.username} 
              </Button>
            </Link>
            </ListItem>
            <ListItem className={classes.listItem}>
            <Signout /> 
          </ListItem>
          </List>
            </div>  
          )
        : (<div>
          <List className={classes.list + " " + classes.mlAuto}>
          <ListItem className={classes.listItem}>
              <FormControl variant="outlined" className={classes.formControl}>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={flag}
                  onChange={(event) => changeLang(event.target.value)}
                  label="flag"
                >
                  <MenuItem value="aze">
                    <img src={aze_flag} style={{width: 30, height: 30}}/>
                  </MenuItem>
                  <MenuItem value="ru">
                    <img src={ru_flag} style={{width: 30, height: 30}}/>
                  </MenuItem>
                  <MenuItem value="en">
                    <img src={en_flag} style={{width: 30, height: 30}}/>
                  </MenuItem>
                </Select>
              </FormControl>
            </ListItem> 

            <ListItem className={classes.listItem}>
            <Button className={classes.username} size="small" variant="outlined"
              onClick={handleDashboardOpen}>
              List your salon
            </Button>
            </ListItem>

            <ListItem className={classes.listItem}>
            <Button className={classes.username} size="small" 
            onClick={handleLoginOpen}>Login/Register</Button>
            </ListItem>
            </List>
            <Dialog
              open={loginOpen}
              onClose={handleLoginClose}
              //aria-labelledby="alert-dialog-title" 
              //aria-describedby="alert-dialog-description"
            >
              <Auth setLoginOpen={setLoginOpen} />
            </Dialog>
            </div>)
        }   
        <Dialog
          open={dashboard}
          onClose={handleDashboardClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Become our business partner</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please login as a salon or freelancer to add salon/service
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDashboardClose} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
  );
}


const HAIR_QUERY = gql`
{
    hairCat{
        id
        title
        salonSet{
          name
        }
      }
}
`;

const NAILS_QUERY = gql`
{
    nailsCat{
        id
        title
        salonSet{
          name
        }
      }
}
`;

const HAIR_REMOVAL_QUERY = gql`
{
    hairRemovalCat{
        id
        title
        salonSet{
          name
        }
      }
}
`;

const MAKEUP_QUERY = gql`
{
    makeupCat{
        id
        title
        salonSet{
          name
        }
      }
}
`;

const MASSAGE_QUERY = gql`
{
    massageCat{
        id
        title
        salonSet{
          name
        }
      }
}
`;

HeaderLinks.defaultProps = {
  hoverColor: "primary"
};

HeaderLinks.propTypes = {
  dropdownHoverColor: PropTypes.oneOf([
    "dark",
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "rose"
  ])
};
