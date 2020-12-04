import React, {useState} from "react";
// import {Link} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next'

// import Navbar from "../components/Partials/Navbar";
import SearchSalons from "components/Partials/SearchSalons";
import Listings from "components/Partials/Listings";

import { Query } from "@apollo/react-components";
import gql from "graphql-tag";


// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles"; 
// import List from "@material-ui/core/List";
// import ListItem from "@material-ui/core/ListItem";
import Hidden from "@material-ui/core/Hidden";
import Dialog from '@material-ui/core/Dialog';
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// core components
// import HeaderLinks from "../components/Partials/HeaderLinks.js";
import Parallax from "components/Partials/Parallax.js";
import GridContainer from "components/Partials/GridContainer.js";
import GridItem from "components/Partials/GridItem.js";
import Button from "components/Partials/Button.js";
import Card from "components/Partials/Card.js";
import CardBody from "components/Partials/CardBody.js";
import Features from "components/Partials/Features.js"
// sections for this page


import presentationStyle from "assets/jss/presentationStyle.js";

const useStyles = makeStyles(presentationStyle);

export default function Home() {
  const { t } = useTranslation();

  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [smallViewSize, setSmallViewSize] = useState(window.innerWidth<960)

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  },[]);


  React.useEffect(() => {
    window.addEventListener("resize", () => setSmallViewSize(window.innerWidth<960));
    return () => {
      window.removeEventListener("resize", () => setSmallViewSize(window.innerWidth<960));

    };
  },[window.innerWidth]);

  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleSearchOpen = () => {
    setOpen(true);
  };

  const handleSearchClose = () => {
    setOpen(false);
  };

  return (
    <div>
        <Dialog
          fullScreen
          open={open}
          onClose={handleSearchClose}
          //aria-labelledby="alert-dialog-title"
          //aria-describedby="alert-dialog-description"
        >
        <Card raised className={classes.card}>
          <CardBody formHorizontal>
            <IconButton
              color="inherit"
              onClick={handleSearchClose}
              style={{float:"right"}}
            >
              <ExitToAppIcon />
            </IconButton>
            <br/>
            <br/>
            <SearchSalons state={setSearchResults} setSearchOpen={setSearchOpen} /> 
          </CardBody>
        </Card>
        </Dialog>
        <Parallax
            image={`${smallViewSize ? require("assets/img/home_parallax.jpeg").default : require("assets/img/p_home2.jpg").default}`}
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
                <br/>
                <Hidden smDown implementation="css">
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <div className={classes.container}>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={12}
                          className={classNames(classes.mlAuto, classes.mrAuto)}
                        >
                          <Card raised className={classes.card}>
                            <CardBody formHorizontal>
                              <SearchSalons state={setSearchResults} setSearchOpen={setSearchOpen}/> 
                            </CardBody>
                          </Card>
                        </GridItem> 
                  </div>
                </Hidden>
                {/* <h2 className={classes.brand}>Find your pearl in the ocean of beauty</h2> */}
                {/* <Hidden smDown implementation="css">
                  <h4 className={classes.brand}>
                  Bridging the gap between personalised salon services, professionals 
                  and online booking experiences, Mirvarim is the new one-stop-shop wellness and beauty 
                  treatment platform that provides a wealth of experts at our fingertips.
                  </h4>
                </Hidden> */}
              </GridItem>

               <div className={classNames(classes.container,classes.search)}>
                <Hidden mdUp implementation="css"> 
                <Button
                  color="white"
                  //justIcon
                  simpler
                  round
                  onClick={handleSearchOpen}
                >
                  <i className="fas fa-search" > {t("Search salon or service")}</i>
                </Button>
                </Hidden>
                </div>
             </GridContainer>
            </div>
        </Parallax> 

        {/* <div className={classNames(classes.main, classes.mainRaised)}> */}
        <div className={classes.main}>
          {/* <Hidden smDown implementation="css">
              <div className={classes.container}>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    className={classNames(classes.mlAuto, classes.mrAuto)}
                  >
                    <Card raised className={classes.card}>
                      <CardBody formHorizontal>
                        <SearchSalons state={setSearchResults} setSearchOpen={setSearchOpen}/> 
                      </CardBody>
                    </Card>
                  </GridItem> 
            </div>
          </Hidden> */}
            <Query query={SALON_QUERY}>
                {({ data, loading, error }) => {
                  if (loading) return <div>Loading</div>;
                  if (error) return <div>Error</div>;
                  const publishedSalons = data.salons.filter(el => el.isPublished === true)
                  const featuredSalons = publishedSalons.filter(el => el.isFeatured === true)

                  return (
                    <div>
                    <h3 className={classes.title1}>{t("Featured Salons")}</h3> 
                    <Listings listings={featuredSalons}/>
                    </div>
                  )
                }}
            </Query>
            <Query query={SALON_QUERY}>
                {({ data, loading, error }) => {
                  if (loading) return <div>Loading</div>;
                  if (error) return <div>Error</div>;
                  const publishedSalons = data.salons.filter(el => el.isPublished === true)
                  const latestSalons = publishedSalons.slice().sort((a,b) => new Date(b.listDate)-new Date(a.listDate)).slice(0,4)
                  //console.log(data.salons.slice().sort((a,b) => new Date(b.listDate)-new Date(a.listDate)))
                  return (
                    <div>
                    <h3 className={classes.title1}>{t("Latest Salons")}</h3> 
                    <Listings listings={latestSalons}/>
                    </div>
                  )
                }}
            </Query>

      <Features />

      <div className={classes.container}>
      {/* <h2 className={classes.title}>About us</h2> */}     
        <p>
        <Trans i18nKey="about">
          Mirvarim is the place to find and book beauty and wellness experiences online. Find your next massage salon 
          discover a trendy new hairdressers or a great nail salon. Discover beauty salons and services in your area 
          and check the availability of dates and times for whenever suits you best. Compare prices, select your desired 
          service with a few clicks and make online payments. After the booking, get immediate confirmation for your beauty 
          treatment. Mirvarim, as a beauty discovery platform is a place for beauty salons to get a great online presence and 
          maximise their exposure. Users can peek inside every salon using our picture galleries, get familiar with a specific 
          salon’s offer with our detailed service overviews and get instant info on opening hours and location. The mission of 
          Mirvarim is to be the go-to discovery platform for all beauty and wellness services anytime, anywhere.
        </Trans>
        </p>
      </div>
      </div>
    </div>
    );
}

const SALON_QUERY = gql`
{
    salons {
        id
        name
        address
        rating  
        priceRange
        photoMain
        isPublished
        isFeatured
        payment
        appointment
        reviewSet{
          id
          rating
        }
        listDate
      }
}
`;