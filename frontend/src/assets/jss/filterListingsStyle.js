import {
    container,
    main,
    mainRaised,
    title,
    cardTitle,
    coloredShadow,
    description,
    mlAuto,
    mrAuto,
    grayColor,
    dangerColor
  } from "./mirvarix-react.js";
  
  const filterListingsStyle = {
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
      margin: "10px 30px 0px",
    },
    container,
    title,
    coloredShadow,
    cardTitle,
    mlAuto,
    mrAuto,
    description,
    salon: {
      padding: "50px 0"
    },
    cardCategory: {
      marginBottom: "0",
      marginTop: "10px",
      "& svg,& .fab,& .fas,& .far,& .fal,& .material-icons": {
        position: "relative",
        top: "8px",
        lineHeight: "0"
      }
    },
    description1: {
      ...description,
      lineHeight: "20px",
      height: "60px",
      paddingBottom:"10px"
    },
    author: {
      "& a": {
        color: grayColor[1],
        textDecoration: "none"
      }
    },
    card: {
      marginBottom: "20px"
    },
    card4: {
      marginBottom: "60px",
      textAlign: "center"
    },
    truncate: {
      display:"-webkit-box",
      //"maxWidth":"100%",
      //"height":"43px",
      margin:"0 auto",
      //"fontSize":"14px",
      //"lineHeight":"1",
      WebkitLineClamp:"3",
      WebkitBoxOrient:"vertical",
      overflow:"hidden",
      textOverflow:"ellipsis"
    },
    priceContainer: {
      display: "inline-flex"
    },
    price: {
      fontSize: "15px",
      color: grayColor[1]
    },
    priceOld: {
      fontSize: "15px",
      color: grayColor[22],
      textDecoration: "line-through"
    },
    priceNew: {
      color: dangerColor[0]
    },
    stats: {
      color: grayColor[0]
    },
    pullCenter: {
      display: "inline-block",
      float: "none"
    },
  };
  
  export default filterListingsStyle;
  