import {
  container,
  cardTitle,
  title,
  mlAuto,
  mrAuto,
  main,
  whiteColor,
  mainRaised,
  grayColor
} from "assets/jss/mirvarix-react.js";

import imagesStyle from "assets/jss/imagesStyles.js";

import tooltipsStyle from "assets/jss/tooltipsStyle.js";

const profilePageStyle = {
  container,
  ...imagesStyle,
  ...tooltipsStyle,
  cardTitleWhite: {
    ...cardTitle,
    color: whiteColor + "  !important"
  },
  cardTitle,
  profile: {
    textAlign: "center",
    "& img": {
      maxWidth: "160px",
      width: "100%",
      margin: "0 auto",
      transform: "translate3d(0, -50%, 0)"
    }
  },
  description: {
    margin: "1.071rem auto 0",
    maxWidth: "600px",
    color: grayColor[0]
  },
  textCenter: {
    textAlign: "center !important"
  },
  name: {
    marginTop: "-80px"
  },

  main: {
    ...main
  },
  mainRaised: {
    ...mainRaised
  },
  title: {
    ...title,
    position: "relative",
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none"
  },
  follow: {
    position: "absolute",
    top: "0",
    right: "0"
  },
  followIcon: {
    width: "20px",
    height: "20px"
  },
  followButton: {
    marginTop: "-28px !important"
  },
  gridItem: {
    ...mlAuto,
    ...mrAuto
  },
  collections: {
    marginTop: "20px"
  },
  cardBody: {
    display: "flex",
    boxOrient: "vertical",
    boxDirection: "normal",
    flexDirection: "column",
    boxPack: "center",
    justifyContent: "center"
  },
  badge: {
    display: "inline-table",
    margin: "0 auto"
  },
  listUnstyled: {
    paddingLeft: "0",
    listStyle: "none",
    "& > li": {
      padding: "5px 0px",
      fontSize: "1em"
    }
  },
  profileTabs: {
    marginTop: "4.284rem",
    marginBottom: "50px"
  },
  // card: {
  //   textAlign: "left !important"
  // },
  card: {
    display: "flex",
    justifyContent: "center"
  },
  block: {
    color: "inherit",
    padding: "0.9375rem",
    fontWeight: "500",
    fontSize: "12px",
    textTransform: "uppercase",
    borderRadius: "3px",
    textDecoration: "none",
    position: "relative",
    display: "block"
  },
  inlineBlock: {
    display: "inline-block",
    padding: "0px",
    width: "auto"
  },
  list: {
    marginBottom: "0",
    padding: "0",
    marginTop: "0"
  },
  left: {
    float: "left!important",
    display: "block"
  },
  right: {
    padding: "15px 0",
    margin: "0",
    float: "right"
  },
  icon: {
    width: "18px",
    height: "18px",
    top: "3px",
    position: "relative"
  },
  parallax: {
    height: "380px",
    backgroundPosition: "top center"
  },
  paper: {
    width: "auto",
    display: "block",
    padding: "15px",
    marginLeft: "15px",
    marginRight: "15px",
    marginTop: "15px",
    marginBottom: "15px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  // title: {
  //   display: "flex",
  //   alignItems: "center",
  //   marginBottom: theme.spacing.unit * 2
  // },
  // audioIcon: {
  //   color: "purple",
  //   fontSize: 30,
  //   marginRight: theme.spacing.unit
  // },
  // thumbIcon: {
  //   color: "green",
  //   marginRight: theme.spacing.unit
  // },
  // divider: {
  //   marginTop: theme.spacing.unit,
  //   marginBottom: theme.spacing.unit
  // }
};

export default profilePageStyle;
