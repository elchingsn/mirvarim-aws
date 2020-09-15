import {
  container,
  mlAuto,
  mrAuto,
  title,
  description,
  blackColor,
  whiteColor,
  hexToRgb
} from "assets/jss/mirvarix-react.js";

const features = {
  container,
  mlAuto,
  mrAuto,
  title,
  description,
  // feature 2 in original
  features1: {
    padding: "20px 0"
  },
  // feature 4 in original
  features2: {
    padding: "20px 0",
    "& $phoneContainer": {
      maxWidth: "300px",
      margin: "40px auto 0"
    }
  },
  gridContainer: {},
  gridItem: {},
  textCenter: {
    textAlign: "center"
  },
  phoneContainer: {
    "& img": {
      width: "100%"
    }
  },
  infoArea: {
    maxWidth: "none",
    margin: "0 auto",
    padding: "10px 0 0px"
  },
  infoArea5: {}
};

export default features;
