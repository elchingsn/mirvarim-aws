import {
  container,
  title,
  description,
  section,
  mlAuto,
  mrAuto,
  twitterColor,
  instagramColor,
  grayColor,
  whiteColor,
  hexToRgb
} from "assets/jss/mirvarix-react.js";

const style = {
  container,
  title,
  mrAuto,
  mlAuto,
  description,
  twitterColor,
  instagramColor,
  section: {
    ...section,
    padding: "70px 0px"
  },
  socialFeed: {
    "& p": {
      display: "table-cell",
      verticalAlign: "top",
      overflow: "hidden",
      paddingBottom: "10px",
      maxWidth: 300
    },
    "& i": {
      fontSize: "20px",
      display: "table-cell",
      paddingRight: "10px"
    }
  },
  dark: {
    background:
      "radial-gradient(ellipse at center," +
      grayColor[4] +
      " 0," +
      grayColor[5] +
      " 100%)",
    backgroundSize: "550% 450%",
    "& $border": {
      borderColor: "rgba(" + hexToRgb(whiteColor) + ",0.1)"
    }
  },
  bigIcons: {
    "& a": {
      margin: 0,
      width: "100% !important",
      paddingTop: "45px",
      paddingBottom: "45px"
    },
    "& button i.fab, & a i.fab": {
      fontSize: "25px !important",
      lineHeight: "90px !important"
    }
  },
  border: {},
  socialLine: {
    padding: ".9375rem 0px",
    "& $border": {
      borderRight: "3px solid rgba(" + hexToRgb(whiteColor) + ",0.25)"
    },
    "& $border:last-child": {
      border: 0
    }
  },
  textCenter: {
    textAlign: "center !important"
  },
  stickyFooter: {
    backgroundColor: "purple",
    fontSize: "20px",
    color: "white",
    borderTop: "1px solid #E7E7E7",
    textAlign: "center",
    padding: "5px",
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "auto",
    width: "100%",
    zIndex: "3"
  },
  button: {
    verticalAlign: "top",
    display: "inline-block",
    textAlign: "center",
    //width: "50px"
  }
}

export default style;
