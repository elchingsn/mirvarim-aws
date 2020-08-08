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
    height: "60vh",
    overflow: "hidden"
  },
  container: {
    ...container,
    zIndex: 1,
    paddingTop:"15vh"
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
  brand: {
    color: whiteColor,
    textAlign: "center",
    "& h1": {
      fontSize: "4.2rem",
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
    marginTop: "30px"
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
  }
};

export default presentationStyle;
