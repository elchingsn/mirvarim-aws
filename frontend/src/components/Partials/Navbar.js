import React, { useState, useEffect } from "react";
import { withRouter } from 'react-router-dom';
import { ApolloConsumer, Query } from "@apollo/react-components";
import gql from "graphql-tag";
import Loading from "../Shared/Loading";
import Error from "../Shared/Error";
import Auth from "../Auth";

import { useTranslation } from 'react-i18next';

// // nodejs library that concatenates classes
// import classNames from "classnames"; 
// // react component for creating beautiful carousel
// import Carousel from "react-slick";
// // @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


// // @material-ui/icons
// import Share from "@material-ui/icons/Share";
// import ShoppingCart from "@material-ui/icons/ShoppingCart";
// core components
import Header from "./Header.js"; 
import HeaderLinks from "components/Partials/HeaderLinks.js";
import UserLinks from "components/Partials/UserLinks.js";
// import Button from "./Button.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import GridItem from "components/Grid/GridItem.js";
// import Card from "components/Card/Card.js";
// import CardBody from "components/Card/CardBody.js";
// import CustomInput from "components/CustomInput/CustomInput.js";

import style from "../../assets/jss/navbarStyle.js";
import HoverDropdown from "../../components/Partials/HoverDropdown";
import CreateSalon from "../../components/Salon/CreateSalon.js";

import { Link } from "react-router-dom";
import Signout from "../Auth/Signout";

import aze_flag from "assets/img/aze.png"
import ru_flag from "assets/img/ru.png"
import en_flag from "assets/img/eng.png"

const useStyles = makeStyles(style);

const Navbar = (props) => {

    const { currentUser, dropdownHoverColor } = props;
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(false);
    const [fbUser, setFbUser] = useState("");
    const [flag, setFlag] = useState("aze");

    const { t, i18n } = useTranslation();

    const handleLoginOpen = () => {
      setOpen(true);
    };
  
    const handleLoginClose = () => {
      setOpen(false);
    };

    const changeLang = (code) => {
      i18n.changeLanguage(code);
      setFlag(code);
    }


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
        {/* <Header
          brand="MIRVARIM"
          color="transparent"   
          fixed
          changeColorOnScroll={{
              height: 210,
              color: "darkSlateBlue"
            }}
          links1 = {<UserLinks currentUser={currentUser} dropdownHoverColor={dropdownHoverColor} />}
          links2 = {<HeaderLinks currentUser={currentUser} dropdownHoverColor={dropdownHoverColor} />}
        /> */}
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

const HAIR_QUERY = gql`
{
    hairCat{
        id
        title
        salonSet{
          name
        }
      }
}
`;

const NAILS_QUERY = gql`
{
    nailsCat{
        id
        title
        salonSet{
          name
        }
      }
}
`;

const HAIR_REMOVAL_QUERY = gql`
{
    hairRemovalCat{
        id
        title
        salonSet{
          name
        }
      }
}
`;

const MAKEUP_QUERY = gql`
{
    makeupCat{
        id
        title
        salonSet{
          name
        }
      }
}
`;

const MASSAGE_QUERY = gql`
{
    massageCat{
        id
        title
        salonSet{
          name
        }
      }
}
`;

const EYEBROW_QUERY = gql`
{
    eyebrowCat{
        id
        title
        salonSet{
          name
        }
      }
}
`;

const COSMETOLOGY_QUERY = gql`
{
    cosmetologyCat{
        id
        title
        salonSet{
          name
        }
      }
}
`;

const TATTOO_QUERY = gql`
{
    tattooCat{
        id
        title
        salonSet{
          name
        }
      }
}
`;

const AESTHETICS_QUERY = gql`
{
    aestheticsCat{
        id
        title
        salonSet{
          name
        }
      }
}
`;

export default withRouter(Navbar); 