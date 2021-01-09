import {
  main,
  mainRaised,
  section,
  container,
  cardTitle,
  coloredShadow,
  mlAuto,
  mrAuto,
  grayColor,
  whiteColor
} from "./mirvarix-react.js";

import customCheckboxRadioSwitch from "./customCheckboxRadioSwitchStyle.js";

import tooltipsStyle from "./tooltipsStyle.js";

const styles = {
  main,
  mainRaised: {
    ...mainRaised,
    "@media (max-width: 576px)": {
      marginTop: "20px"
    },
    "@media (max-width: 830px)": {
      marginLeft: "10px",
      marginRight: "10px",
      marginTop: "20px"
    },
    margin: "10px 0px 0px",
  },
  tab:{
      background: whiteColor,
      zIndex: "3"
  },
  ...customCheckboxRadioSwitch,
  ...tooltipsStyle,
  checkRoot: {
    paddingTop: "5px",
    paddingLeft: "14px",
    paddingRight: "14px",
    "&:hover": {
      backgroundColor: "unset"
    }
  },
  coloredShadow,
  mlAuto,
  mrAuto,
  cardTitle: {
    ...cardTitle,
    textAlign: "center",
    marginBottom: "0px !important"
  },
  cardDescription: {
    color: grayColor[0],
    textAlign: "center"
  },
  container: {
    ...container
  },
  description: {
    color: grayColor[0]
  },
  section: {
    ...section,
    padding: "70px 0px"
  },
  priceContainer: {
    display: "inline-flex"
  },
  price: {
    fontSize: "18px",
    color: grayColor[22]
  },
  pullRight: {
    float: "right"
  },
  cardHeaderImage: {
    position: "relative",
    padding: "0",
    zIndex: "1",
    marginLeft: "15px",
    marginRight: "15px",
    marginTop: "-30px",
    borderRadius: "6px",
    "& img": {
      width: "100%",
      borderRadius: "6px",
      pointerEvents: "none"
    },
    "& a": {
      display: "block"
    }
  },
  justifyContentBetween: {
    WebkitBoxPack: "justify!important",
    justifyContent: "space-between !important"
  },
  customExpandPanel: {
    maxHeight: "273px",
    overflowY: "scroll",
    "&  label": {
      display: "block"
    }
  },
  priceSlider: {
    fontWeight: "500"
  },
  refineButton: {
    margin: "-3px 0"
  },
  cardBodyRefine: {
    paddingLeft: "15px",
    paddingRight: "15px"
  },
  textLeft: {
    textAlign: "left"
  },
  paddingTB: {
    paddingTop: "15px",
    paddingBottom:"15px"
  },
  paddingB: {
    paddingBottom:"15px"
  },
  pagination: {
    '& > * + *': {
      paddingTop: "30px",
    },
  },
  hidden: {
    width: "100%"
  },
  closeButtonDrawer: {
    position: "absolute",
    right: "8px",
    top: "9px",
    zIndex: "1"
  },
  stickyFilter: {
    fontSize: "20px",
    color: "white",
    padding: "10px",
    position: "fixed",
    left: "0",
    bottom: "130px",
    height: "auto",
    width: "100%",
    zIndex: "3",
    display: "flex",
    justifyContent: "center"
  },
  button: {
    padding: "15px",
  },
  sup: {
    verticalAlign: "super",
    fontSize: "smaller"
  }
};

export default styles;
