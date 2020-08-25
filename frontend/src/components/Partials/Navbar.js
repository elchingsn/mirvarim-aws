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
      return (
        <div>
          {(currentUser && currentUser.role == "A_3")?
          (<CreateSalon/>) :
          (<div> Login as a salon to add salon</div>)
          }
        </div>
      );
    }


    if(props.location.pathname.match(/review/)){
      return (null);
    }

    if(props.location.pathname.match(/salon/)){
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

    return(

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

            // links={
            //   <div className={classes.collapse}>
            //     <List className={classes.list + " " + classes.mlAuto}>

            //         <ListItem className={classes.listItem}>
            //         <Query query={HAIR_QUERY}>
            //             {({ data, loading, error }) => {
            //             if (loading) return <Loading />;
            //             if (error) return <Error error={error} />;
            //             const categories = data.hairCat;

            //             return <HoverDropdown 
            //                 noLiPadding
            //                 navDropdown
            //                 hoverColor={dropdownHoverColor}
            //                 buttonText = {t("Hair")} 
            //                 dropdownList={categories} 
            //                 buttonProps={{
            //                   className: classes.navLink,
            //                   color: "transparent"
            //                 }}
            //                 />;
            //             }}
            //         </Query>
            //         </ListItem>

            //         <ListItem className={classes.listItem}>
            //         <Query query={NAILS_QUERY}>
            //             {({ data, loading, error }) => {
            //             if (loading) return <Loading />;
            //             if (error) return <Error error={error} />;
            //             const categories = data.nailsCat;

            //             return <HoverDropdown 
            //                 noLiPadding
            //                 navDropdown
            //                 hoverColor={dropdownHoverColor}
            //                 buttonText = "Nails" 
            //                 dropdownList={categories} 
            //                 buttonProps={{
            //                   className: classes.navLink,
            //                   color: "transparent"
            //                 }}
            //                 />;
            //             }}
            //         </Query>
            //         </ListItem>

            //         <ListItem className={classes.listItem}>
            //         <Query query={HAIR_REMOVAL_QUERY}>
            //             {({ data, loading, error }) => {
            //             if (loading) return <Loading />;
            //             if (error) return <Error error={error} />;
            //             const categories = data.hairRemovalCat;

            //             return <HoverDropdown 
            //                 noLiPadding
            //                 navDropdown
            //                 hoverColor={dropdownHoverColor}
            //                 buttonText = "Hair Removal" 
            //                 dropdownList={categories} 
            //                 buttonProps={{
            //                   className: classes.navLink,
            //                   color: "transparent"
            //                 }}
            //                 />;
            //             }}
            //         </Query>
            //         </ListItem>

            //         <ListItem className={classes.listItem}>
            //         <Query query={MAKEUP_QUERY}>
            //             {({ data, loading, error }) => {
            //             if (loading) return <Loading />;
            //             if (error) return <Error error={error} />;
            //             const categories = data.makeupCat;

            //             return <HoverDropdown 
            //                 noLiPadding
            //                 navDropdown
            //                 hoverColor={dropdownHoverColor}
            //                 buttonText = "Makeup" 
            //                 dropdownList={categories} 
            //                 buttonProps={{
            //                   className: classes.navLink,
            //                   color: "transparent"
            //                 }}
            //                 />;
            //             }}
            //         </Query>
            //         </ListItem>

            //         <ListItem className={classes.listItem}>
            //         <Query query={MASSAGE_QUERY}>
            //             {({ data, loading, error }) => {
            //             if (loading) return <Loading />;
            //             if (error) return <Error error={error} />;
            //             const categories = data.massageCat;

            //             return <HoverDropdown 
            //                 noLiPadding
            //                 navDropdown
            //                 hoverColor={dropdownHoverColor}
            //                 buttonText = {t("Massage")} 
            //                 dropdownList={categories} 
            //                 buttonProps={{
            //                   className: classes.navLink,
            //                   color: "transparent"
            //                 }}
            //                 />;
            //             }}
            //         </Query>
            //         </ListItem> 
            //         <ListItem>
            //         </ListItem>  
            //         <ListItem>
            //           <FormControl className={classes.formControl}>
            //             <Select
            //               labelId="demo-simple-select-outlined-label"
            //               id="demo-simple-select-outlined"
            //               value={flag}
            //               onChange={(event) => changeLang(event.target.value)}
            //               label="Age"
            //             >
            //               <MenuItem value="aze">
            //                 <img src={aze_flag} style={{width: 30, height: 30}}/>
            //               </MenuItem>
            //               <MenuItem value="ru">
            //                 <img src={ru_flag} style={{width: 30, height: 30}}/>
            //               </MenuItem>
            //               <MenuItem value="en">
            //                 <img src={en_flag} style={{width: 30, height: 30}}/>
            //               </MenuItem>
            //             </Select>
            //           </FormControl>
            //         </ListItem>  

            //       </List>

            //     {/* Auth User Info */}
            //     {currentUser
            //      ? (<div style={{float:"right"}}>                   
            //         <Link to={"/partner"} className={classes.grow}>
            //         <Button className={classes.listItem} variant="outlined"
            //           onClick={(e)=> e.preventDefault}>
            //           <h5 style={{margin:"5px"}}>List your salon</h5>
            //         </Button>
            //         </Link>
            //         <Link to={`/profile/${currentUser.id}`} className={classes.grow}>
            //         <Typography variant="headline" className={classes.username} noWrap>
            //         {currentUser.username}
            //         </Typography>
            //         </Link>
            //         <Signout /> 
            //         </div>  
            //       )
            //      : (<div>
            //         <Link to={"/partner"} className={classes.grow}>
            //         <Button className={classes.listItem} variant="outlined"
            //           onClick={(e)=> e.preventDefault}>
            //           <h5 style={{margin:"5px"}}>List your salon</h5>
            //         </Button>
            //         </Link>
            //         <Button className={classes.username} size="small" 
            //         onClick={handleLoginOpen}>Login/Register</Button>
            //         <Dialog
            //           open={open}
            //           onClose={handleLoginClose}
            //           //aria-labelledby="alert-dialog-title"
            //           //aria-describedby="alert-dialog-description"
            //         >
            //           <Auth/>
            //         </Dialog>
            //         </div>)
            //     }
                       
            //     {/* <List className={classes.list + " " + classes.mlAuto}>
            //         <ListItem className={classes.listItem}>
            //         <Button
            //             color="transparent"
            //             href="https://twitter.com"
            //             target="_blank"
            //             className={classes.navLink + " " + classes.navLinkJustIcon}
            //         >
            //             <i className={"fab fa-twitter"} />
            //         </Button>
            //         </ListItem>
            //         <ListItem className={classes.listItem}>
            //         <Button
            //             color="transparent"
            //             href="https://www.facebook.com/"
            //             target="_blank"
            //             className={classes.navLink + " " + classes.navLinkJustIcon}
            //         >
            //             <i className={"fab fa-facebook"} />
            //         </Button>
            //         </ListItem>
            //         <ListItem className={classes.listItem}>
            //         <Button
            //             color="transparent"
            //             href="https://www.instagram.com/"
            //             target="_blank"
            //             className={classes.navLink + " " + classes.navLinkJustIcon}
            //         >
            //             <i className={"fab fa-instagram"} />
            //         </Button>
            //         </ListItem>
            //     </List> */}
            //   </div>
            // }
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

export default withRouter(Navbar); 