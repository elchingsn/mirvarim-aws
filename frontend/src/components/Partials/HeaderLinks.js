import React, { useState } from "react";
import { Query } from "@apollo/react-components";
import gql from "graphql-tag";
import Loading from "../Shared/Loading";
import Error from "../Shared/Error";

import { useTranslation } from 'react-i18next';

import PropTypes from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import HoverDropdown from "../../components/Partials/HoverDropdown";

// import aze_flag from "assets/img/aze.png"
// import ru_flag from "assets/img/ru.png"
// import en_flag from "assets/img/eng.png"

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
  const { dropdownHoverColor } = props;
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  //const [open, setOpen] = useState(false);
  //const [flag, setFlag] = useState(localStorage.getItem("i18nextLng"));

  // const handleLoginOpen = () => {
  //   setOpen(true);
  // };

  // const handleLoginClose = () => {
  //   setOpen(false);
  // };

  // const changeLang = (code) => {
  //   i18n.changeLanguage(code);
  //   setFlag(code);
  // }

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
                    buttonText = {t("Hair Removal")}
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
                    buttonText = {t("Makeup")} 
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
            <ListItem className={classes.listItem}>
            <Query query={EYEBROW_QUERY}>
                {({ data, loading, error }) => {
                if (loading) return <Loading />;
                if (error) return <Error error={error} />;
                const categories = data.eyebrowCat;

                return <HoverDropdown 
                    noLiPadding
                    navDropdown
                    hoverColor={dropdownHoverColor}
                    buttonText = {t("Eyebrow")} 
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
            <Query query={COSMETOLOGY_QUERY}>
                {({ data, loading, error }) => {
                if (loading) return <Loading />;
                if (error) return <Error error={error} />;
                const categories = data.cosmetologyCat;

                return <HoverDropdown 
                    noLiPadding
                    navDropdown
                    hoverColor={dropdownHoverColor}
                    buttonText = {t("Cosmetology")} 
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
            <Query query={TATTOO_QUERY}>
                {({ data, loading, error }) => {
                if (loading) return <Loading />;
                if (error) return <Error error={error} />;
                const categories = data.tattooCat;

                return <HoverDropdown 
                    noLiPadding
                    navDropdown
                    hoverColor={dropdownHoverColor}
                    buttonText = {t("Tattoo/Piercing")} 
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
            <Query query={AESTHETICS_QUERY}>
                {({ data, loading, error }) => {
                if (loading) return <Loading />;
                if (error) return <Error error={error} />;
                const categories = data.aestheticsCat;

                return <HoverDropdown 
                    noLiPadding
                    navDropdown
                    hoverColor={dropdownHoverColor}
                    buttonText = {t("Aesthetics")} 
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
            {/* <ListItem>
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
            </ListItem>  */}
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
          id
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
          id
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
          id
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
          id
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
          id
          name
        }
      }
}
`;

const EYEBROW_QUERY = gql`
{
    eyebrowCat{
        id
        title
        salonSet{
          id
          name
        }
      }
}
`;

const COSMETOLOGY_QUERY = gql`
{
    cosmetologyCat{
        id
        title
        salonSet{
          id
          name
        }
      }
}
`;

const TATTOO_QUERY = gql`
{
    tattooCat{
        id
        title
        salonSet{
          id
          name
        }
      }
}
`;

const AESTHETICS_QUERY = gql`
{
    aestheticsCat{
        id
        title
        salonSet{
          id
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
