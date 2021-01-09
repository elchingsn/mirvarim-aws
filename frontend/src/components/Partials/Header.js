import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
import Close from "@material-ui/icons/Close";
// core components
import styles from "assets/jss/headerStyle.js";
import mirvarim_logo from "assets/img/mirvarim1.png"

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import aze_flag from "assets/img/aze.png"
import ru_flag from "assets/img/ru.png"
import en_flag from "assets/img/eng.png"
import { useTranslation } from 'react-i18next';


const useStyles = makeStyles(styles);

const Header = (props) => {
  const { t, i18n } = useTranslation();
  const [flag, setFlag] = React.useState(localStorage.getItem("i18nextLng"));
  const changeLang = (code) => {
    i18n.changeLanguage(code);
    setFlag(code);
  }


  const [mobileOpen, setMobileOpen] = React.useState(false);
  const classes = useStyles();
  React.useEffect(() => {
    if (props.changeColorOnScroll) {
      window.addEventListener("scroll", headerColorChange);
    }
    return function cleanup() {
      if (props.changeColorOnScroll) {
        window.removeEventListener("scroll", headerColorChange);
      }
    };
  });
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    setFlag(localStorage.getItem("i18nextLng"))
  };
  const headerColorChange = () => {
    const { color, changeColorOnScroll } = props;

    const windowsScrollTop = window.pageYOffset;
    if (windowsScrollTop > changeColorOnScroll.height) {
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[changeColorOnScroll.color]);
    } else {
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[changeColorOnScroll.color]);
    }
  };
  const { color, links1, links2, brand, fixed, absolute } = props;
  const appBarClasses = classNames({
    [classes.appBar]: true,
    [classes[color]]: color,
    [classes.absolute]: absolute,
    [classes.fixed]: fixed
  });
  return (
    <AppBar className={appBarClasses}>
      <Toolbar className={classes.container}> 
        <Hidden mdUp implementation="css" className={classes.hidden}>
          <Link to="/"><img src={mirvarim_logo} alt="logo" style={{width: 123, height: 39, marginTop: "0px"}}/></Link>
          {props.location.pathname === "/" &&
            (<FormControl className={classes.flag} >
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={flag}
                onChange={(event) => changeLang(event.target.value)}
                label="flag"
              >
                <MenuItem value="aze">
                  <img alt="az" src={aze_flag} style={{width: 25, height: 25}}/>
                </MenuItem>
                <MenuItem value="ru">
                  <img alt="ru" src={ru_flag} style={{width: 25, height: 25}}/>
                </MenuItem>
                <MenuItem value="en">
                  <img alt="en" src={en_flag} style={{width: 25, height: 25}}/>
                </MenuItem>
              </Select>
            </FormControl>)}
        </Hidden>
        <Hidden smDown implementation="css" className={classes.hidden}>
          {/* <div className={classes.collapse1}>{links.props.children[1]}</div>
          <div className={classes.collapse}>{links.props.children[0]}</div> */}
          <div className={classes.collapse}>{links1}</div> 
          <div className={classes.collapse1}>{links2}</div> 
        </Hidden>
        <Hidden mdUp>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
      <Hidden mdUp implementation="js">
        <Drawer
          variant="temporary"
          anchor={"right"}
          open={mobileOpen}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={handleDrawerToggle}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            className={classes.closeButtonDrawer}
          >
            <Close />
          </IconButton>
          <div onClick={handleDrawerToggle} className={classes.appResponsive}>{links2}</div>
          <div className={classes.appResponsive}>{links1}</div>
        </Drawer>
      </Hidden>
    </AppBar>
  );
}

export default withRouter(Header); 

Header.defaultProp = {
  color: "white"
};

Header.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "transparent",
    "white",
    "rose",
    "dark",
    "darkSlateBlue"
  ]),
  links: PropTypes.node,
  brand: PropTypes.string,
  fixed: PropTypes.bool,
  absolute: PropTypes.bool,
  // this will cause the sidebar to change the color from
  // props.color (see above) to changeColorOnScroll.color
  // when the window.pageYOffset is heigher or equal to
  // changeColorOnScroll.height and then when it is smaller than
  // changeColorOnScroll.height change it back to
  // props.color (see above)
  changeColorOnScroll: PropTypes.shape({
    height: PropTypes.number.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "info",
      "success",
      "warning",
      "danger",
      "transparent",
      "white",
      "rose",
      "dark",
      "darkSlateBlue"
    ]).isRequired
  })
};
