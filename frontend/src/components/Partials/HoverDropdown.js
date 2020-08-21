import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";
// import { Query } from "react-apollo";
import gql from "graphql-tag";
import classNames from "classnames";
import PropTypes from "prop-types";

import { useTranslation } from 'react-i18next';

//import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grow from "@material-ui/core/Grow";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from '@material-ui/core/styles';

import Button from "./Button.js";
//import headersStyle from "../../assets/jss/headersStyle.js";
import styles from "../../assets/jss/customDropdownStyle.js";

const useStyles = makeStyles(styles);

const HoverDropdown = (props) => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);
    const [buttonon, setButtonon] = useState(false);
    const [menuon, setMenuon] = useState(false);

    const { t, i18n } = useTranslation();
    
    const handleButtonClick = (event) => {
        setButtonon(true);
        if (!menuon){setMenuon(!menuon)}; 
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClick = () =>{
        setMenuon(false);

    };
  
    const handleButtonClose = () => setTimeout(() => {
        setButtonon(false);   
        if (menuon) {
            return;
        }
        setAnchorEl(null); 
    }, 150);
   
    const handleMenuClose = () => {
        setMenuon(false);
        setAnchorEl(null);
    };

 
    useEffect(() => {setTimeout(()=>{
        // console.log(`menu:${menuon}`);
        // console.log(`button:${buttonon}`); 
        if (!buttonon && menuon) {setAnchorEl(null)};
        },1)},[buttonon]);
 
    const open = Boolean(anchorEl);
    const id = open ? 'menu-list-grow' : undefined;

    const {
      buttonText,
      buttonIcon,
      dropdownList,
      buttonProps,
      dropup,
      dropdownHeader,
      caret,
      hoverColor,
      dropPlacement,
      rtlActive,
      noLiPadding,
      innerDropDown,
      navDropdown
    } = props;

    const caretClasses = classNames({
      [classes.caret]: false,
      [classes.caretDropup]: dropup && !anchorEl,
      [classes.caretActive]: Boolean(anchorEl) && !dropup,
      [classes.caretRTL]: rtlActive
    });
    const dropdownItem = classNames({
      [classes.dropdownItem]: true,
      [classes[hoverColor + "Hover"]]: true,
      [classes.noLiPadding]: noLiPadding,
      [classes.dropdownItemRTL]: rtlActive
    });
  
    const onMenuItemClick = (category) =>{
      console.log({category})
      //window.location.reload()
    }
    return (
      // <div className={classes.root}>
      <div>
        <div>
          <Link to={{
            pathname: "/salon",
            // state: {
            //   catValue: buttonText,
            //   checkedCat: category.title
            // }
            state: {catValue: buttonText}

          }}>
            <Button
              aria-controls={id}
              aria-haspopup="true"
              onClick={handleButtonClick}
              onMouseEnter={handleButtonClick}
              onMouseLeave={handleButtonClose}
              href="#x"
              //onClick={e => e.preventDefault()}
              {...buttonProps}
              //style={{color:"white"}}
              className={classes.button}
            >
              {buttonText}
             </Button>
          </Link>
          <Popper 
            open={open} 
            anchorEl={anchorEl} 
            role={undefined} 
            transition 
            disablePortal
            placement={dropPlacement}
            className={classNames({
            [classes.popperClose]: !anchorEl,
            [classes.pooperResponsive]: true,
            [classes.pooperNav]: Boolean(anchorEl) && navDropdown
            })}
          >
              {() => (
                <Grow
                in={open}
                id="menu-list"
                style={
                  dropup
                    ? { transformOrigin: "0 100% 0" }
                    : { transformOrigin: "0 0 0" }
                }
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleMenuClose}>
                      <MenuList
                          id="menu-list-grow"
                          role="menu" 
                          className={classes.menuList}
                          onMouseEnter = {handleMenuClick}
                          onMouseLeave = {handleMenuClose}
                      >
                        {dropdownList.map(category => (
                          <Link to={{
                            pathname: "/salon",
                            state: {
                              catValue: buttonText,
                              checkedCat: category.title
                            }
                            // state: [buttonText, category.title]
                          }}>
                          <MenuItem 
                          key={category.id}
                          className={dropdownItem}
                          style={{ overflow: "visible", padding: 3 }} 
                          onClick={() => onMenuItemClick(category)}
                          >
                            {t(`${category.title}`)}
                          </MenuItem>    
                          </Link>         
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}                                                        
          </Popper>
        </div>
      </div>
    );


};

export const SALON_QUERY = gql`
  {
    salons (search: "hair1"){
      name
      city {
        title
      }
      address
      hairCategories {
        title
      }
    }
  }
`;

// export default withStyles(styles)(HoverDropdown);
export default HoverDropdown;

HoverDropdown.defaultProps = {
  caret: true,
  dropup: false,
  hoverColor: "primary"
};

HoverDropdown.propTypes = {
  hoverColor: PropTypes.oneOf([
    "dark",
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "rose"
  ]),
  buttonText: PropTypes.node,
  buttonIcon: PropTypes.object,
  dropdownList: PropTypes.array,
  buttonProps: PropTypes.object,
  dropup: PropTypes.bool,
  dropdownHeader: PropTypes.node,
  rtlActive: PropTypes.bool,
  caret: PropTypes.bool,
  dropPlacement: PropTypes.oneOf([
    "bottom",
    "top",
    "right",
    "left",
    "bottom-start",
    "bottom-end",
    "top-start",
    "top-end",
    "right-start",
    "right-end",
    "left-start",
    "left-end"
  ]),
  noLiPadding: PropTypes.bool,
  innerDropDown: PropTypes.bool,
  navDropdown: PropTypes.bool,
  // This is a function that returns the clicked menu item
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func
};
