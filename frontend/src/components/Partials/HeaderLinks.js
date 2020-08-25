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
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Icon from "@material-ui/core/Icon";

import style from "../../assets/jss/navbarStyle.js";
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

  const { dropdownHoverColor } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(false);
  const [fbUser, setFbUser] = useState("");
  const [flag, setFlag] = useState(localStorage.getItem("i18nextLng"));

  const { t, i18n } = useTranslation();

  const handleLoginOpen = () => {
    setOpen(true);
  };

  const handleLoginClose = () => {
    setOpen(false);
  };

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    setFlag(code);
  }


  return (
      <div className={classes.collapse}>
        <List className={classes.list + " " + classes.mlAuto}>

            <ListItem className={classes.listItem}>
            <Query query={HAIR_QUERY}>
                {({ data, loading, error }) => {
                if (loading) return <Loading />;
                if (error) return <Error error={error} />;
                const categories = data.hairCat;

                return <HoverDropdown 
                    noLiPadding
                    navDropdown
                    hoverColor={dropdownHoverColor}
                    buttonText = {t("Hair")}
                    dropdownList={categories} 
                    buttonProps={{
                      className: classes.navLink,
                      color: "transparent"
                    }}
                    />;
                }}
            </Query>
            </ListItem>

            <ListItem className={classes.listItem}>
            <Query query={NAILS_QUERY}>
                {({ data, loading, error }) => {
                if (loading) return <Loading />;
                if (error) return <Error error={error} />;
                const categories = data.nailsCat;

                return <HoverDropdown 
                    noLiPadding
                    navDropdown
                    hoverColor={dropdownHoverColor}
                    buttonText = {t("Nails")} 
                    dropdownList={categories} 
                    buttonProps={{
                      className: classes.navLink,
                      color: "transparent"
                    }}
                    />;
                }}
            </Query>
            </ListItem>

            <ListItem className={classes.listItem}>
            <Query query={HAIR_REMOVAL_QUERY}>
                {({ data, loading, error }) => {
                if (loading) return <Loading />;
                if (error) return <Error error={error} />;
                const categories = data.hairRemovalCat;

                return <HoverDropdown 
                    noLiPadding
                    navDropdown
                    hoverColor={dropdownHoverColor}
                    buttonText = "Hair Removal" 
                    dropdownList={categories} 
                    buttonProps={{
                      className: classes.navLink,
                      color: "transparent"
                    }}
                    />;
                }}
            </Query>
            </ListItem>

            <ListItem className={classes.listItem}>
            <Query query={MAKEUP_QUERY}>
                {({ data, loading, error }) => {
                if (loading) return <Loading />;
                if (error) return <Error error={error} />;
                const categories = data.makeupCat;

                return <HoverDropdown 
                    noLiPadding
                    navDropdown
                    hoverColor={dropdownHoverColor}
                    buttonText = "Makeup" 
                    dropdownList={categories} 
                    buttonProps={{
                      className: classes.navLink,
                      color: "transparent"
                    }}
                    />;
                }}
            </Query>
            </ListItem>

            <ListItem className={classes.listItem}>
            <Query query={MASSAGE_QUERY}>
                {({ data, loading, error }) => {
                if (loading) return <Loading />;
                if (error) return <Error error={error} />;
                const categories = data.massageCat;

                return <HoverDropdown 
                    noLiPadding
                    navDropdown
                    hoverColor={dropdownHoverColor}
                    buttonText = {t("Massage")} 
                    dropdownList={categories} 
                    buttonProps={{
                      className: classes.navLink,
                      color: "transparent"
                    }}
                    />;
                }}
            </Query>
            </ListItem> 
            <ListItem>
            </ListItem> 
            <ListItem>
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
          </List>
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
