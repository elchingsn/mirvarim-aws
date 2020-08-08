import {
    container,
    section,
    main,
    mainRaised,
    mlAuto,
    mrAuto,
    title,
    cardTitle,
    grayColor,  
    whiteColor,
    roseColor
  } from "./mirvarix-react.js";
  
  import tooltipsStyle from "./tooltipsStyle.js";
  import imagesStyles from "./imagesStyles.js";
  import customSelectStyle from "./customSelectStyle.js";
  
  const salonDetailStyle = {
    mlAuto,
    main,
    tab:{
        background: whiteColor,
        zIndex: "3"
    },
    ...imagesStyles,
    ...customSelectStyle,
    ...tooltipsStyle,
    container: {
      ...container,
      zIndex: 2
    },
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
      margin: "10px 30px 0px",
    },
    section: {
      ...section,
      padding: "10px 0px"
    },
    title: {
      ...title,
      marginBottom: 0
    },
    sectionGray: {
      background: grayColor[14]
    },
    mainPrice: {
      margin: "10px 0px 25px" 
    },
    textCenter: {
      textAlign: "center!important"
    },
    features: {
      paddingTop: "10px",
    },
    paddingTLR: {
      paddingTop: "10px",
      paddingLeft: "20px",
      paddingRight: "20px"
    },
    paddingLR: {
      paddingLeft: "30px",
      paddingRight: "30px"
    },
    marginLR:{
      margin:"0 30px"
    },
    paddingT: {
      paddingTop: "30px"
    },
    paddingL: {
      paddingLeft: "30px"
    },
    paddingR:{
      paddingRight: "30px"
    },
    productPage: {
      backgroundColor: grayColor[2],
      "& $mainRaised": {
        margin: "-40vh 0 0",
        padding: "40px"
      },
      "& .image-gallery-slide img": {
        borderRadius: "3px",
        maxWidth: "300px",
        height: "auto"
      },
      "& .image-gallery-swipe": {
        margin: "30px 0px",
        overflow: "hidden",
        width: "100%",
        height: "auto",
        textAlign: "center"
      },
      "& .image-gallery-thumbnails > .image-gallery-thumbnails-container a": {
        "&.active > div": {
          opacity: "1",
          borderColor: grayColor[6]
        },
        "& > div": {
          width: "80%",
          maxWidth: "85px",
          margin: "0 auto",
          padding: "8px",
          display: "block",
          border: "1px solid transparent",
          background: "transparent",
          borderRadius: "3px",
          opacity: ".8"
        },
        "& > div img": {
          borderRadius: "3px",
          width: "100%",
          height: "auto",
          textAlign: "center"
        }
      }
    },
    titleRow: {
      marginTop: "-8vh"
    },
    floatRight: {
      float: "right!important"
    },
    pageHeader: {
      minHeight: "60vh",
      maxHeight: "600px",
      height: "auto",
      backgroundPosition: "top center"
    },
    relatedProducts: {
      marginTop: "50px",
      "& $title": {
        marginBottom: "80px"
      }
    },
    pickSize: {
      marginTop: "20px"
    },
    pullRight: {
      float: "right"
    },
    cardCategory: {
      textAlign: "center",
      marginTop: "10px"
    },
    cardTitle: {
      ...cardTitle,
      textAlign: "center"
    },
    cardDescription: {
      textAlign: "center",
      color: grayColor[0]
    },
    textRose: {
      color: roseColor[0]
    },
    justifyContentBetween: {
      justifyContent: "space-between!important"
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
    img: {
      width: "20%",
      marginRight: "5%",
      marginBottom: "5%",
      float: "left"
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
      margin: "0 30px",
      float: "right"
    },
    icon: {
      top: "3px",
      width: "18px",
      height: "18px",
      position: "relative"
    },

    parallax: {
        height: "10vh",
        overflow: "hidden"
      },
    card: {
        marginTop: "30px"
    },

    navbar: {
      display: "flex",
      alignItems: "left",
      justifyContent: "space-between",
      padding: "0rem 1rem",
      position: "absolute",
      zIndex: "1",
      width: "100%"
    },
    navbarSticky: {
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      background: grayColor[2],
      position: "fixed",
      alignItems: "center",
      width: "100%",
      top: "0",
      left: "0",
      boxShadow: "1px 1px 1px #222",
      animation: "moveDown 0.5s ease-in-out",
    }
    
  };
  
  export default salonDetailStyle;
  