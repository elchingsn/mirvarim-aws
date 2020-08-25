import React, {useState} from "react";
import {Link} from "react-router-dom";

// import Navbar from "../components/Partials/Navbar";
import SearchSalons from "../components/Partials/SearchSalons";
import Listings from "../components/Partials/Listings";

import { ApolloConsumer, Query } from "@apollo/react-components";
import gql from "graphql-tag";


// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles"; 
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Hidden from "@material-ui/core/Hidden";
// core components
import Header from "../components/Partials/Header.js";
// import HeaderLinks from "../components/Partials/HeaderLinks.js";
import Parallax from "../components/Partials/Parallax.js";
import Footer from "../components/Partials/Footer.js";
import GridContainer from "../components/Partials/GridContainer.js";
import GridItem from "../components/Partials/GridItem.js";
import Button from "../components/Partials/Button.js";
import Card from "../components/Partials/Card.js";
import CardBody from "../components/Partials/CardBody.js";
import CustomInput from "../components/Partials/CustomInput.js";
// sections for this page


import presentationStyle from "assets/jss/presentationStyle.js";

const useStyles = makeStyles(presentationStyle);

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const classes = useStyles();
  return (
    <div>

        <Parallax
            image={require("../assets/img/home_parallax.jpeg")}
            className={classes.parallax}
        >
            <div className={classes.container}>
            <GridContainer>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                className={classNames(
                  classes.mlAuto,
                  classes.mrAuto,
                  classes.textCenter
                )}
              >
                <h2 className={classes.brand}>Find your pearl in the ocean of beauty!!</h2>
                <Hidden smDown implementation="css">
                  <h4 className={classes.brand}>
                  Bridging the gap between personalised salon services, professionals 
                  and online booking experiences, Mirvarim is the new one-stop-shop wellness and beauty 
                  treatment platform that provides a wealth of experts at our fingertips.
                  </h4>
                </Hidden>
              </GridItem>
              {/* <GridItem
                xs={12}
                sm={12}
                md={12}
                className={classNames(classes.mlAuto, classes.mrAuto)}
              >
                <Card raised className={classes.card}>
                  <CardBody formHorizontal>
                    <SearchSalons state = {setSearchResults} /> 
                  </CardBody>
                </Card>
              </GridItem>  */}
             </GridContainer>
          </div>
        </Parallax> 

        {/* <div className={classNames(classes.main, classes.mainRaised)}> */}
        <div className={classes.main}>
          <div className={classes.container}>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                className={classNames(classes.mlAuto, classes.mrAuto)}
              >
                <Card raised className={classes.card}>
                  <CardBody formHorizontal>
                    <SearchSalons state = {setSearchResults} /> 
                  </CardBody>
                </Card>
              </GridItem> 
         </div>
            <Query query={SALON_QUERY}>
                {({ data, loading, error }) => {
                if (loading) return <div>Loading</div>;
                if (error) return <div>Error</div>;
                const featuredSalons = data.salons.filter(el => el.isFeatured == true)
                console.log('salon list', data.salons);
                console.log('featured salons', featuredSalons);
                return <Listings listings={featuredSalons}/>;
                }}
            </Query>
      <div className={classes.container}>
      {/* <h2 className={classes.title}>About us</h2> */}
        <p>
        Mirvarim is the place to find and book beauty and wellness experiences online. Find your next massage salon,
        discover a trendy new hairdressers or a great nail salon. Discover beauty salons and services in your area 
        and check the availability of dates and times for whenever suits you best. Compare prices, select your desired 
        service with a few clicks and make online payments. After the booking, get immediate confirmation for your beauty 
        treatment. You have further questions? Don’t hesitate to reach out to our friendly staff that will assist you in 
        every step of the booking process. Mirvarim, as a beauty discovery platform is a place for beauty salons to get a 
        great online presence and maximise their exposure. They can showcase their work and connect with customers, both old 
        and new. Users can peek inside every salon using our picture galleries, get familiar with a specific salon’s offer 
        with our detailed service overviews & get instant info on opening hours & location. The mission of Mirvarim is to be
        the go-to discovery platform for all beauty and wellness services anytime, anywhere. 
        </p>
      </div>
      </div>
    </div>
    );
};

const SALON_QUERY = gql`
{
    salons {
        id
        name
        address
        rating  
        priceRange
        photoMain
        reviewSet{
          rating
        }
        isFeatured
      }
}
`;