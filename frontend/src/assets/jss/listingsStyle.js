import {
  container,
  title,
  description,
  mlAuto,
  mrAuto,
  section,
  sectionDark,
  coloredShadow,
  blackColor,
  whiteColor,
  hexToRgb
} from "./mirvarix-react.js";

const listingsSection = {
  container,
  title: {
    ...title,
    textAlign: "center",
    marginTop: "10px"
  },
  mlAuto,
  mrAuto,
  cardTitle: {
    marginTop:"5px",
    marginBottom:"5px",
    fontWeight:"bold"
  },
  coloredShadow,
  description,
  descriptionWhite: {
    ...description
  },
  textCenter: {
    textAlign: "center"
  },
  team: {
    padding: "10px 0",
    "& h5$description,& h5$descriptionWhite": {
      marginBottom: "50px"
    }
  },
  section: {
    ...sectionDark,
    ...section,
    position: "relative",
    "& $title": {
      color: whiteColor
    },
    "& $descriptionWhite": {
      color: "rgba(" + hexToRgb(whiteColor) + ", 0.76)"
    },
    "& $container": {
      zIndex: "2",
      position: "relative"
    },
    "&:after": {
      position: "absolute",
      zIndex: "1",
      width: "100%",
      height: "100%",
      display: "block",
      left: "0",
      top: "0",
      content: "''",
      backgroundColor: "rgba(" + hexToRgb(blackColor) + ", 0.7)"
    }
  },
  justifyContent: {
    WebkitBoxPack: "center !important",
    MsFlexPack: "center !important",
    justifyContent: "center !important"
  },
  cardCategory: {
    marginTop: "0px",
    marginBottom:"3px"
  },
  btn: {
    marginTop: "0 !important"
  },
  card3: {
    textAlign: "left"
  },
  card5: {
    textAlign: "left",
    "& $cardTitle": {
      color: whiteColor
    },
    "& $description": {
      color: whiteColor
    }
  }
};

export default listingsSection;
