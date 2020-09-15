import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from "classnames";
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
  SvgIcon
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { THEMES } from 'constants.js';
import Account from './Account';
import Settings from './Settings';
import mirvarim_logo from "assets/img/mirvarim1.png"

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 100,
    ...theme.name === THEMES.LIGHT ? {
      boxShadow: 'none',
      backgroundColor: theme.palette.primary.main
    } : {},
    ...theme.name === THEMES.DARK ? {
      backgroundColor: theme.palette.background.default
    } : {}
  },
  toolbar: {
    minHeight: 64
  }
}));

const TopBar = ({
  className,
  onMobileNavOpen,
  user,
  ...rest
}) => {
  const classes = useStyles();
  console.log("inside TopBar");

  return (
    <AppBar
      className={classNames(classes.root, className)}
      {...rest}
    >
      <Toolbar className={classes.toolbar}>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <SvgIcon fontSize="small">
              <MenuIcon />
            </SvgIcon>
          </IconButton>
        </Hidden>
        <Hidden mdDown>
          <Link to="/">
           <Link to="/"><img src={mirvarim_logo} style={{width: 140, height: 50, marginTop: "0px"}}/></Link>
          </Link>
        </Hidden>
        <Box
          ml={2}
          flexGrow={1}
        />
        {/* <Settings /> */}
        <Box ml={2}>
          <Account user={user}/>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

TopBar.defaultProps = {
  onMobileNavOpen: () => {}
};

export default TopBar;
