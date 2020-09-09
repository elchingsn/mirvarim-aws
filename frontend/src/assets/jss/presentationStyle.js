import {
  container,
  title,
  main,
  whiteColor,
  grayColor,
  mainRaised, 
  hexToRgb,
  mlAuto,
  mrAuto
} from "./mirvarix-react.js";
import footerStyle from "./footerStyle.js";

const presentationStyle = {
  ...footerStyle,
  title:{
    ...title,
    color: "grayColor[1]",
    textAlign: "center"
  }, 
  main: {
    ...main
    /*overflow: "hidden"*/
  },
  mainRaised,
  parallax: {
    height: "39vh",
    overflow: "hidden"
  },
  container: {
    ...container,
    zIndex: 1,
    paddingTop:"3vh"
  },
  conatiner2: {
    ...container,
    zIndex: "2",
    position: "relative",
    "& h1, & h4, & h6": {
      color: whiteColor
    },
    paddingTop: "25vh"
  },
  title: {
    ...title,
    color: whiteColor
  },
  title1: {
    ...title,
    textAlign: "center",
    marginTop: "30px"
  },
  brand: {
    color: whiteColor,
    textAlign: "center",
    "& h1": {
      fontSize: "3rem",
      fontWeight: "600",
      display: "inline-block",
      position: "relative"
    }
  },
  proBadge: {
    position: "relative",
    fontSize: "22px",
    textTransform: "uppercase",
    fontWeight: "700",
    right: "-10px",
    padding: "10px 18px",
    top: "-30px",
    background: whiteColor,
    borderRadius: "3px",
    color: grayColor[18],
    lineHeight: "22px",
    boxShadow: "0 5px 5px -2px rgba(" + hexToRgb(grayColor[25]) + ",.4)"
  },

  mlAuto,
  textCenter: {
    textAlign: "center"
  },
  mrAuto,
  textCenter: {
    textAlign: "center"
  },
  card: {
    marginTop: "15px"
  },
  formControl: {
    margin: "0",
    padding: "8px 0 0 0"
  },
  textRight: {
    textAlign: "right"
  },
  button: {
    margin: "0 !important"
  },
  listbox: {
    width: 300,
    margin: 0,
    padding: 0,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: whiteColor,
    overflow: 'auto',
    maxHeight: 250,
    border: '1px solid rgba(0,0,0,.25)',
    '& li': {
      padding: "2px 5px",
      margin: "0px",
      display: "flex",
      '& span': {
        flexGrow: "1",
        margin: "52px 55px"
      }
    },
    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    },
    '& li:active': {
      backgroundColor: '#2977f5',
      color: 'white',
    }
  },
  input: {
    padding: "0px", //no effect
  },
  search: {
    display: "flex",
    justifyContent: "center",
    width:"100%"
  }
};

export default presentationStyle;
