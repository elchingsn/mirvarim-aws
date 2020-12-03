import React from "react";
import { withRouter } from 'react-router-dom';
//import { useTranslation } from 'react-i18next';
//import { makeStyles } from "@material-ui/core/styles";

import Header from "./Header.js"; 
import HeaderLinks from "components/Partials/HeaderLinks.js";
import UserLinks from "components/Partials/UserLinks.js";

// import style from "assets/jss/navbarStyle.js";
// const useStyles = makeStyles(style);

const Navbar = (props) => {

    const { currentUser, dropdownHoverColor } = props;

    if(props.location.pathname.match(/partner/)){
      return (null);
    }

    if(props.location.pathname.match(/review/)){
      return (
        <div>
        <Header
              //brand="MIRVARIM"
              color="darkSlateBlue"   
              // fixed
              // changeColorOnScroll={{
              //     height: 400,
              //     color: "darkSlateBlue"
              //   }}  
              // 
              links1 = {<UserLinks currentUser={currentUser} />}
        />
      </div>
      );
    }

    if((props.location.pathname.match(/salon/))||(props.location.pathname.match(/profile/))) {
      return (
        <div>
          <Header
            //brand="MIRVARIM"
            color="darkSlateBlue"   
            // fixed
            // changeColorOnScroll={{
            //     height: 400,
            //     color: "darkSlateBlue"
            //   }}  
            // 
            links1 = {<UserLinks currentUser={currentUser} />}
            links2 = {<HeaderLinks dropdownHoverColor={dropdownHoverColor} />}
          />
        </div>
      );
    }

    if((props.location.pathname.match(/activate/))||(props.location.pathname.match(/password-reset/))
        ||(props.location.pathname.match(/login/))) {
      return (
        <div>
          <Header
                //brand="MIRVARIM"
                color="darkSlateBlue"   
                // fixed
                // changeColorOnScroll={{
                //     height: 400,
                //     color: "darkSlateBlue"
                //   }}  
                // 
                //links1 = {<UserLinks currentUser={currentUser} />}
          />
        </div>
      );
    }

    if(props.location.pathname === "/") {
      return (
        <div>
        <Header
          brand="MIRVARIM"
          color="transparent"   
          fixed
          changeColorOnScroll={{
              height: 210,
              color: "darkSlateBlue"
            }}
          links1 = {<UserLinks currentUser={currentUser} dropdownHoverColor={dropdownHoverColor} />}
          links2 = {<HeaderLinks currentUser={currentUser} dropdownHoverColor={dropdownHoverColor} />}
        />
        </div>
      );
    }

    return(
      <div>
        <Header
          //brand="MIRVARIM"
          color="darkSlateBlue"   
          // fixed
          // changeColorOnScroll={{
          //     height: 400,
          //     color: "darkSlateBlue"
          //   }}  
          // 
          links1 = {<UserLinks currentUser={currentUser} />}
          links2 = {<HeaderLinks dropdownHoverColor={dropdownHoverColor} />}
        />
      </div>
    );
};

export default withRouter(Navbar); 