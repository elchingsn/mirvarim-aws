import React from "react";
import {Link} from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Rating from '@material-ui/lab/Rating';
// @material-ui/icons
// import  from "@material-ui/icons/";
// core components
import GridContainer from "./GridContainer.js";
import GridItem from "./GridItem.js";
import Card from "./Card.js";
import CardAvatar from "./CardAvatar.js";
import CardHeader from "./CardHeader.js";
import CardBody from "./CardBody.js";
import CardFooter from "./CardFooter.js";
import Button from "./Button.js";
import Muted from "./Muted.js";

import styles from "../../assets/jss/listingsStyle.js";

const useStyles = makeStyles(styles);

const Listings = ({listings}) => {
    const classes = useStyles();

    const API_BASE = `${process.env.REACT_APP_API_BASE}/media`    

    return (
      <div className={classes.team}>
        <div className={classes.container}>
        <h3 className={classes.title}>Featured Salons</h3> 
          {/* <GridContainer>
            <GridItem
              xs={12}
              sm={8}
              md={8}
              className={
                classes.mlAuto + " " + classes.mrAuto + " " + classes.textCenter
              }
            >
              <h3 className={classes.title}>Featured Salons</h3> 
              <h5 className={classes.description}>
              </h5>
            </GridItem>
          </GridContainer> */}
          <GridContainer>
            {listings.map(listing =>{
              const ratingList = listing.reviewSet.length ? listing.reviewSet.map(node => node.rating) : []
              const countReviews = ratingList.length
              const avgRating = ratingList.length ? (ratingList.reduce((avgRating,x) => avgRating + x)/countReviews).toFixed(1) : 0

              return (
                <GridItem xs={12} sm={6} md={4}>
                <Link to={`/salon/${listing.id}`}>
                <Card plain profile>
                  <CardHeader image plain>
                      {/* <img src={require(`../../../../media/${listing.photoMain}`)} */}
                      <img src={`${API_BASE}/${listing.photoMain}`}
                      style={{height:"250px"}}
                      alt="..." />
                
                    <div
                      className={classes.coloredShadow}
                      style={{
                        backgroundImage: `url(../../../../media/${listing.photoMain})`,
                        opacity: "1"
                      }}
                    />
                  </CardHeader>
                  <CardBody plain>
                    <h4 className={classes.cardTitle}>{listing.name}</h4>
                    <Rating name="read-only" size="small" value={avgRating} precision={0.1} readOnly />
                    <h5 className={classes.cardCategory}>{listing.address}</h5>
                  </CardBody>
                  {/* <CardFooter profile plain className={classes.justifyContent}>
                  </CardFooter> */}
                </Card>
                </Link>
              </GridItem>
            )})}
            </GridContainer>
        </div>
      </div>

    );
}

export default Listings;