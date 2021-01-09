import {
  grayColor,
  whiteColor,
  darkSlateBlue,
  mlAuto,
  hexToRgb
} from "./mirvarix-react.js";

import tooltip from "./tooltipsStyle.js";

const navbarStyle = theme => ({
  list: {
    [theme.breakpoints.up("md")]: {
      WebkitBoxAlign: "center",
      MsFlexAlign: "center",
      alignItems: "center",
      justifyContent: "flex-start",
      WebkitBoxOrient: "horizontal",
      WebkitBoxDirection: "normal",
      MsFlexDirection: "row",
      flexDirection: "row",
      paddingRight: "20px",
    },
    [theme.breakpoints.down("sm")]: {
      display: "block",
      color: darkSlateBlue, //new no effect
      alignItems: "start", // no effect
      paddingRight: "20px",
      paddingTop: "25px"
    },
    marginTop: "0px",
    display: "flex",
    justifyContent: "flex-start",
    paddingLeft: "0",
    marginBottom: "0",
    listStyle: "none",
    padding: "0",
    alignItems: "start"
  },
  listItem: {
    float: "left",
    color: "inherit",
    position: "relative",
    display: "block",
    width: "auto",
    margin: "0",
    padding: "0",
    [theme.breakpoints.down("sm")]: {
      "& ul": {
        color: darkSlateBlue, //new no effect
      //   maxHeight: "400px",
      //   overflow: "scroll"
      },
      justifyContent: "flex-start", // no effect
      width: "100%",
      "&:not(:last-child)": {
        "&:after": {
          width: "calc(100% - 30px)",
          content: '""',
          display: "block",
          height: "1px",
          marginLeft: "0px",
          backgroundColor: grayColor[14]
        }
      }
    }
  },
  listItemText: {
    padding: "0 !important"
  },
  navLink: {
    color: "inherit",
    position: "relative",
    padding: "0.9375rem",
    fontWeight: "400",
    fontSize: "16px",
    textTransform: "uppercase",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "inline-flex",
    "&:hover,&:focus": {
      color: "inherit"
    },
    "& .fab,& .far,& .fal,& .fas,& .material-icons": {
      position: "relative",
      top: "2px",
      marginTop: "-4px",
      marginRight: "4px",
      marginBottom: "0px",
      fontSize: "1.25rem"
    },
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 30px)",
      marginLeft: "15px",
      marginBottom: "8px",
      marginTop: "8px",
      textAlign: "left",
      color: darkSlateBlue, //new no effect
      "& > span:first-child": {
        justifyContent: "flex-start"
      }
    },
    "& svg": {
      marginRight: "3px",
      width: "20px",
      height: "20px"
    }
  },
  navLinkJustIcon: {
    "& .fab,& .far,& .fal,& .fas,& .material-icons": {
      marginRight: "0px"
    },
    "& svg": {
      marginRight: "0px"
    }
  },
  navButton: {
    position: "relative",
    fontWeight: "400",
    fontSize: "12px",
    textTransform: "uppercase",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "inline-flex",
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 30px)",
      marginLeft: "15px",
      marginBottom: "5px",
      marginTop: "5px",
      textAlign: "left",
      "& > span:first-child": {
        justifyContent: "flex-start"
      }
    },
    "& $icons": {
      marginRight: "3px"
    }
  },
  notificationNavLink: {
    color: "inherit",
    padding: "0.9375rem",
    fontWeight: "400",
    fontSize: "12px",
    textTransform: "uppercase",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "inline-flex"
  },
  registerNavLink: {
    position: "relative",
    fontWeight: "400",
    fontSize: "12px",
    textTransform: "uppercase",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "inline-flex"
  },
  navLinkActive: {
    "&, &:hover, &:focus,&:active ": {
      color: "inherit",
      backgroundColor: "rgba(" + hexToRgb(whiteColor) + ", 0.1)"
    }
  },
  icons: {
    width: "20px",
    height: "20px",
    marginRight: "14px"
  },
  dropdownIcons: {
    width: "24px",
    height: "24px",
    marginRight: "14px",
    opacity: "0.5",
    marginTop: "-4px",
    top: "1px",
    verticalAlign: "middle",
    fontSize: "24px",
    position: "relative"
  },
  socialIcons: {
    position: "relative",
    fontSize: "1.25rem",
    maxWidth: "24px"
  },
  dropdownLink: {
    "&,&:hover,&:focus": {
      color: "inherit",
      textDecoration: "none",
      display: "flex",
      padding: "0.75rem 1.25rem 0.75rem 0.75rem"
    }
  },
  ...tooltip,
  marginRight5: {
    marginRight: "5px"
  },
  collapse: {
    [theme.breakpoints.up("md")]: {
      display: "flex !important",
      MsFlexPreferredSize: "auto",
      //flexBasis: "auto",
      // justifyContent: "flex-end",
      // alignItems: "center"
    },
    WebkitBoxFlex: "1",
    MsFlexPositive: "1",
    flexGrow: "1",
    WebkitBoxAlign: "center",
    MsFlexAlign: "center",
    alignItems: "center"
  },
  mlAuto,
  grow: {
    //flexGrow: 1,
    position: "relative",
    // display: "block",
    // alignItems: "right",
    textDecoration: "none",
    padding: "0 25px"
  },
  username: {
    color: "white",
    verticalAlign: "center",
    paddingTop: "5px",
    position: "relative",
    textTransform: 'none',
    fontSize: "0.75rem",
    [theme.breakpoints.down("sm")]:{
      color: darkSlateBlue //new effective
    }
  },
  usernameIcon: {
    color: "white",
    //verticalAlign: "center",
    //paddingTop: "-10px",
    //position: "relative",
    textTransform: 'none',
    fontSize: "1.2rem",
    [theme.breakpoints.down("sm")]:{
      color: darkSlateBlue //new effective
    }
  },
  select: {
    border: '1px solid',
    background: 'transparent',
    color: 'inherit',
      '& option': {
        backgroundColor: 'transparent',
        color: '#fff' }
  },
  formControl: {
    borderBottom: "none"
  }
});

export default navbarStyle;
