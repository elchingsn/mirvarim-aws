import React, {useRef, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import classNames from "classnames";
import { useTranslation } from 'react-i18next';
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
import Tooltip from "@material-ui/core/Tooltip";
import Divider from '@material-ui/core/Divider';
//icons 
import FavoriteIcon from '@material-ui/icons/Favorite';
import blueGrey from '@material-ui/core/colors/blueGrey';
import purple from '@material-ui/core/colors/purple';


import styles from "../../assets/jss/filterListingsStyle.js";
import { concat } from "apollo-link";

const useStyles = makeStyles(styles);

const FilterListings = ({listings}) =>{
    const { t, i18n } = useTranslation();
    console.log(listings)

    const classes = useStyles();
    const API_BASE = `${process.env.REACT_APP_API_BASE}/media`    
    const [isFavorite, setFavorite] = useState(false)
    return(
        <div>
        {listings.map(listing => {
        const hairServices = listing.hairserviceSet
        const nailsServices = listing.nailsserviceSet
        const hairRemovalServices = listing.hairremovalserviceSet
        const makeupServices = listing.makeupserviceSet
        const massageServices = listing.massageserviceSet
        const services = [...hairServices, ...nailsServices, ...hairRemovalServices, ...makeupServices, ...massageServices]
        console.log(services)
        const ratingList = listing.reviewSet.length ? listing.reviewSet.map(node => node.rating) : []
        const countReviews = ratingList.length
        const avgRating = ratingList.length ? (ratingList.reduce((avgRating,x) => avgRating + x)/countReviews).toFixed(1) : 0
        return(
        <Link to={`/salon/${listing.id}`} style={{ textDecoration: 'none' }}>
        <Card plain className={classes.card} className={classNames(classes.tab, classes.mainRaised)}>
            <GridContainer>
                <GridItem xs={12} sm={5} md={5}>
                <CardHeader image plain>
                    <img src={`${API_BASE}/${listing.photoMain}`} 
                        style={{height:"200px"}}
                        alt="..." />
                    <div
                    className={classes.coloredShadow}
                    style={{
                        backgroundImage: `url(../../../../media/${listing.photoMain})`,
                        opacity: "1"
                    }}
                    />
                    <div
                    className={classes.coloredShadow}
                    style={{
                        backgroundImage: `url(../../../../media/${listing.photoMain})`,
                        opacity: "1"
                    }}
                    />
                </CardHeader>
                </GridItem>
                <GridItem style={{paddingLeft:"25px"}} xs={11} sm={6} md={6}>
                <h2 className={classes.cardTitle}>
                    {listing.name}
                </h2>
                <h4>{listing.address}</h4>
                <div>
                  <Rating name="read-only" size="small" value={avgRating} precision={0.1} readOnly />
                </div>
                <span>{countReviews} {t("reviews")}</span>
                <p className={classNames(classes.description1, classes.truncate)}>
                    {listing.description}
                </p>
                {/* <a style={{color:"salmon", display:"inline"}}>More</a> */}
                </GridItem>
                
                {/* <GridItem xs={1} sm={1} md={1}> 
                    <Tooltip
                      id="tooltip-top"
                      title="Saved to Wishlist"
                      placement="left"
                      style={{paddingRight:"10px"}}
                    >
                     <button
                        className={classes.pullRight}
                        style ={{color:"gray", border:"none", backgroundColor:"inherit",cursor:"pointer"}}
                        onClick={(event)=> {
                          event.preventDefault()
                          console.log(event)
                          setFavorite(!isFavorite)
                        }}>
                        {isFavorite ? 
                        (<FavoriteIcon color="error" />) :
                        (<FavoriteIcon/>)}
                      </button>
                    </Tooltip>
                </GridItem> */}
            </GridContainer>
            <Divider/>
              {services[0] && (
              <CardFooter style={{padding:"10px"}}>
                  <>
                  <div className={classes.priceContainer}>
                    {services[0].title} 
                  </div>
                  <div style={{paddingLeft:"15px"}}>
                    &nbsp;  
                    <i className="far fa-clock">&nbsp;{services[0].duration} min</i>
                  </div>
                  <div className={classNames(classes.stats, classes.mlAuto)}>
                    {services[0].promotionPrice ? (
                    <>
                    <span className={classNames(classes.priceOld)}>
                      {" "}
                      AZN {services[0].price}
                    </span>
                    <span className={classNames(classes.price, classes.priceNew)}>
                      {" "}
                      AZN {services[0].promotionPrice}
                    </span>
                    </> ) : (
                    <span className={classNames(classes.price)}>
                      {" "}
                      AZN {services[0].price}
                    </span> 
                    )}
                  </div>
                  </>
          </CardFooter>
          )}
          <Divider/>
             {services[1] && (
              <CardFooter style={{padding:"10px"}}>
                  <>
                  <div className={classes.priceContainer}>
                    {t(`${services[1].title}`)}
                  </div>
                  <div style={{paddingLeft:"15px"}}>
                    &nbsp;  
                    <i className="far fa-clock">&nbsp;{services[1].duration} {t("min")}</i>
                  </div>
                  <div className={classNames(classes.stats, classes.mlAuto)}>
                    {services[1].promotionPrice ? (
                    <>
                    <span className={classNames(classes.priceOld)}>
                      {" "}
                      AZN {services[1].price}
                    </span>
                    <span className={classNames(classes.price, classes.priceNew)}>
                      {" "}
                      AZN {services[1].promotionPrice}
                    </span>
                    </> ) : (
                    <span className={classNames(classes.price)}>
                      {" "}
                      AZN {services[1].price}
                    </span> 
                    )}
                  </div>
                  </>
          </CardFooter>
          )}
                    <Divider/>
             {services[2] && (
              <CardFooter style={{padding:"10px"}}>
                  <>
                  <div className={classes.priceContainer}>
                  {t(`${services[2].title}`)} 
                  </div>
                  <div style={{paddingLeft:"15px"}}>
                    &nbsp;  
                    <i className="far fa-clock">&nbsp;{services[2].duration} {t("min")}</i>
                  </div>
                  <div className={classNames(classes.stats, classes.mlAuto)}>
                    {services[2].promotionPrice ? (
                    <>
                    <span className={classNames(classes.priceOld)}>
                      {" "}
                      AZN {services[2].price}
                    </span>
                    <span className={classNames(classes.price, classes.priceNew)}>
                      {" "}
                      AZN {services[2].promotionPrice}
                    </span>
                    </> ) : (
                    <span className={classNames(classes.price)}>
                      {" "}
                      AZN {services[2].price}
                    </span> 
                    )}
                  </div>
                  </>
          </CardFooter>
          )}
        </Card>
        </Link>
        )})}
        </div>
    );
};

export default FilterListings;







