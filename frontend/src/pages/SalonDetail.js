import React, {useState, useContext, useRef} from "react";
import {Link} from "react-router-dom";
import classNames from "classnames";
import ImageGallery from "react-image-gallery";

import { Query } from "@apollo/react-components";
import gql from "graphql-tag";

import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import Rating from '@material-ui/lab/Rating';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Divider from '@material-ui/core/Divider';

import GridContainer from "../components/Partials/GridContainer.js";
import GridItem from "../components/Partials/GridItem.js";
import Card from "../components/Partials/Card.js";
import CardBody from "../components/Partials/CardBody.js";
import SearchSalons from "../components/Partials/SearchSalons.js";
import Filter from "../components/Partials/Filter.js";
import Accordion from "components/Partials/Accordion.js";
import Button from "components/Partials/Button.js";

import Loading from "components/Shared/Loading";
import Error from "components/Shared/Error";
import Auth from "components/Auth"

import Sticky from 'utils/sticky/Sticky.js';

import { UserContext, ME_QUERY } from "App";

import styles from "../assets/jss/salonDetailStyle.js";
import ReviewList from "components/Partials/ReviewList.js";
import CardFooter from "components/Partials/CardFooter.js";
const useStyles = makeStyles(styles);

const RatingDistribution = ({value, progress, quantity}) => {

  return(
  <GridContainer>
    <GridItem xs={4} sm={3} md={2}>
      <Box display="flex" justifyContent="flex-end" alixgnItems="flex-start">
        <Box>
          <Rating name="read-only" size="small" value={value} readOnly />
        </Box>
      </Box>
    </GridItem>
    <GridItem xs={6} sm={7} md={8} style={{paddingLeft:"0px", paddingRight:"0px"}}> 
            <div style={{backgroundColor:"gray",borderRadius:"13px", marginTop:"7px"}}>
                <div style={{backgroundColor:"orange",borderRadius:"10px",height:"2px", width:`${progress}%`}}></div>
            </div> 
    </GridItem>
    <GridItem xs={2} sm={2} md={2}> 
      <Box display="flex" justifyContent="flex-start" alignContent="flex-start">
        <Box display="flex" justifyContent="flex-start" alignItems="flex-start">
          <h6 style={{marginTop:"0px", marginBottom:"0px"}}> {quantity} </h6>
        </Box>
      </Box>
    </GridItem>
  </GridContainer>
  );
  }

const SalonDetail=({match}) => {
    const classes = useStyles();
    const currentUser = useContext(UserContext);
    console.log(currentUser)

    const [open, setOpen] = useState(false);
    const [colorSelect, setColorSelect] = useState("0");
    const [searchResults, setSearchResults] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [smallViewSize, setSmallViewSize] = useState(true)
 
    const id = match.params.id;
    const API_BASE = `${process.env.REACT_APP_API_BASE}/media`    
    console.log(id);

    // const { isSticky, element } = Sticky()

    // React.useEffect(() => {
    //     window.scrollTo(0, 0);
    //     document.body.scrollTop = 0;
    //   }, []);

 
    const [isSticky, setSticky] = React.useState(false);
    const stickyRef = useRef(null);
    const aboutRef = useRef(null);
    const servicesRef = useRef(null);
    const reviewRef = useRef(null);

    const handleScroll = () => {
        // console.log("REF",stickyRef);
        stickyRef.current && stickyRef.current.getBoundingClientRect().top < 0
        ? setSticky(true)
        : setSticky(false)

        if (reviewRef.current && reviewRef.current.getBoundingClientRect().top<0) {
          setTabIndex(2)
        } else if (servicesRef.current && servicesRef.current.getBoundingClientRect().top<0) {
          setTabIndex(1)
        } else {
          setTabIndex(0)
        }
        console.log(tabIndex);
    };

    const handleTabChange = (event, newValue) => {
      setTabIndex(newValue);
      switch(newValue) {
        case 0: 
          handleScrollTo(aboutRef);
          break;
        case 1: 
          handleScrollTo(servicesRef);
          break;
        case 2: handleScrollTo(reviewRef);       
      }
    };

    const handleScrollTo = (elRef) =>{
      const el = elRef.current ? elRef.current : elRef;
      console.log(el);
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    };

    const RateButton = ({xs, sm, md}) => {
      return(
        <GridItem xs={xs} sm={sm} md={md} className={classNames(classes.floatRight)}>
          <Box display="flex" justifyContent="flex-end">
          <Box>
          {currentUser
          ? (<Link to={`/review/${id}`}> 
              <Button 
                color="info" 
                size="lg" 
                simple
                className={`${smallViewSize? "classes.floatright" : "classes.right"}`}>
                <AddCircleOutlineIcon className={classes.addIcon}/>
                <span> Rate </span>
              </Button>
            </Link>)
          : ( <div>
                <Button 
                  onClick={() => setOpen(true)} 
                  color="info" 
                  size="lg" 
                  simple
                  className={`${smallViewSize? "classes.floatright" : "classes.right"}`}>  
                  <AddCircleOutlineIcon className={classes.addIcon}/>
                  <span> Rate </span>
                </Button>
                <Dialog
                  open={open}
                  onClose={() => setOpen(false)}
                >
                  <Auth/>
                </Dialog>
              </div>)
          }
          </Box>
          </Box>
        </GridItem>
      );
    }

    React.useEffect(() => {
      setSmallViewSize(window.innerWidth<960)
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    React.useEffect(() => {
      window.addEventListener("resize", () => setSmallViewSize(window.innerWidth<960));
      return () => {
        window.removeEventListener("resize", () => setSmallViewSize(window.innerWidth<960));

      };
    },[window.innerWidth]);
      
    return (
    <div>
        {/* <div className={classes.container}>
        <GridContainer>
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
        </GridContainer>
        </div> */}

        <Query query={SELECTED_SALON_QUERY} variables={{ id }}>
        {({ data, loading, error }) => {
            if (loading) return <Loading />;
            if (error) return <Error error={error} />;
            console.log(data.salonSelected[0]);
            const salon = data.salonSelected[0];
            const hairServices = salon.hairserviceSet
            const nailsServices = salon.nailsserviceSet
            const hairRemovalServices = salon.hairremovalserviceSet
            const makeupServices = salon.makeupserviceSet
            const massageServices = salon.massageserviceSet
            const services = [...hairServices, ...nailsServices, ...hairRemovalServices, ...makeupServices, ...massageServices]    
            const _raw_images = [salon.photoMain, salon.photo1, salon.photo2, salon.photo3,
                salon.photo4, salon.photo5, salon.photo6];
            const _images = _raw_images.filter((el) => el!="");
            const numImages = _images.filter(Boolean).length;
            
            // const images = [
            //     { original: require(`../../../media/${salon.photoMain}`),
            //     thumbnail: require(`../../../media/${salon.photoMain}`)
            //     }
            // ];

            const images = [
              { original: `${API_BASE}/${salon.photoMain}`,
              thumbnail: `${API_BASE}/${salon.photoMain}`
              }
            ];

            console.log(images);

            for (let i=1; i<numImages; i++){
                const photo = _images[i];
                let src = `${API_BASE}/${photo}`;
                console.log(src);
                images.push(
                    { original: src,
                    thumbnail: src,
                    }
                );
            };

            return (
            <div className={classNames(classes.section, classes.sectionGray)}>
                <div className={classes.container}>
                <div className={classNames(classes.main, classes.mainRaised)}>
                    <GridContainer>
                    <GridItem md={6} sm={6} className={classes.paddingTLR}>
                        <ImageGallery
                        showFullscreenButton={true}
                        showPlayButton={false}      
                        startIndex={0}
                        items={images}
                        />
                    </GridItem>
                    <GridItem md={6} sm={6} className={classes.paddingL}>
                        <h2 className={classes.title}>{salon.name}</h2>
                        <h5>{salon.address}</h5>
                        
                        {/* <GridContainer className={classes.paddingR}>
                          <GridItem md={12} sm={12}>
                             <p> {salon.description} </p>
                          </GridItem>
                        </GridContainer> */}

                        <GridContainer className={classes.pickSize}>
                        <GridItem md={6} sm={6}>
                            <label>Opening Hours</label>
                            <FormControl
                            fullWidth
                            className={classes.selectFormControl}
                            >
                            <Select
                                MenuProps={{
                                className: classes.selectMenu
                                }}
                                classes={{
                                select: classes.select
                                }}
                                value={colorSelect}
                                onChange={event => setColorSelect(event.target.value)}
                                inputProps={{
                                name: "colorSelect",
                                id: "color-select"
                                }}
                            >
                                <MenuItem
                                classes={{
                                    root: classes.selectMenuItem,
                                    selected: classes.selectMenuItemSelected
                                }}
                                value="0"
                                >
                                9.00-13.00
                                </MenuItem>
                                <MenuItem
                                classes={{
                                    root: classes.selectMenuItem,
                                    selected: classes.selectMenuItemSelected
                                }}
                                value="1"
                                >
                                13.00-18.00
                                </MenuItem>
                                <MenuItem
                                classes={{
                                    root: classes.selectMenuItem,
                                    selected: classes.selectMenuItemSelected
                                }}
                                value="2"
                                >
                                18.00-22.00
                                </MenuItem>
                            </Select>
                            </FormControl>
                        </GridItem>

                        <GridItem md={6} sm={6}>
                            <Rating name="read-only" size="small" value={salon.rating} readOnly />
                            <h5>View all reviews</h5>
                            </GridItem>
                        </GridContainer>

                        {/* <GridContainer className={classes.pullRight}>
                        <Button round color="rose">
                            Add to Cart &nbsp; <ShoppingCart />
                        </Button>
                        </GridContainer> */}
                    </GridItem>
                    </GridContainer>
                </div>
                </div>

                <div className={classes.container} ref={stickyRef} >
                  <div className={classNames(classes.main, classes.mainRaised)} ref={aboutRef}>
                  <nav className={isSticky ? 
                    classNames(classes.navbar, classes.navbarSticky) : classes.navbar}>
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                      >
                        <Tab label="About" />
                        <Tab label="Services" />
                        <Tab label="Reviews" />
                    </Tabs>
                  </nav>
                  <GridContainer>
                    <GridItem md={12} sm={12} className={classNames(classes.paddingLR, classes.paddingT)}>
                      <p style={{fontSize:"18px", marginTop:"30px", color:"inherit"}}> About</p>
                      <p> {salon.description} </p>
                    </GridItem>
                  </GridContainer>
                  </div>

                  <div className={classNames(classes.tab, classes.mainRaised)} ref={servicesRef}>
                  <GridContainer>
                    <GridItem md={12} sm={12} className={classNames(classes.paddingLR,classes.paddingT)}>
                    <p style={{fontSize:"18px", color:"inherit"}}>Services</p>
                        <Accordion
                          //active={0}
                          activeColor="info"
                          collapses={[
                              {
                              title: "",
                              content: (
                                <div>
                                {services.map(service => (
                                <>
                                <CardFooter style={{paddingTop:"5px",paddingBottom:"5px",paddingLeft:"0px"}}>
                                    <>
                                    <div className={classes.priceContainer}>
                                      {service.title} 
                                    </div>
                                    <div style={{paddingLeft:"15px"}}>
                                      &nbsp;  
                                      <i className="far fa-clock">&nbsp;{service.duration} min</i>
                                    </div>
                                    <div className={classNames(classes.stats, classes.mlAuto)}>
                                      {service.promotionPrice ? (
                                      <>
                                      <span className={classNames(classes.priceOld)}>
                                        {" "}
                                        AZN {service.price}
                                      </span>
                                      <span className={classNames(classes.price, classes.priceNew)}>
                                        {" "}
                                        AZN {service.promotionPrice}
                                      </span>
                                      </> ) : (
                                      <span className={classNames(classes.price)}>
                                        {" "}
                                        AZN {service.price}
                                      </span> 
                                      )}
                                    </div>
                                    </>
                            </CardFooter>
                            <Divider/>
                            </>
                            ))}
                            </div>
                              )
                              }
                          ]}
                        />
                    </GridItem>
                  </GridContainer>
                  </div>

                  <div className={classNames(classes.tab, classes.mainRaised)} ref={reviewRef}>
                    <Query query={REVIEW_QUERY} variables={{ id }}>
                        {({ data, loading, error }) => {
                        if (loading) return <div>Loading</div>;
                        if (error) return <div>Error</div>;
                        // calculations on data returned from query
                        const ratingList = data.reviews.map(node => node.rating)
                        const countReviews = ratingList.length
                        const ratedFive = ratingList.filter(x => x==5).length
                        const ratedFour = ratingList.filter(x => x==4).length
                        const ratedThree = ratingList.filter(x => x==3).length
                        const ratedTwo = ratingList.filter(x => x==2).length
                        const ratedOne = ratingList.filter(x => x==1).length
                        const progressFive = ratedFive*100/countReviews
                        const progressFour = ratedFour*100/countReviews
                        const progressThree = ratedThree*100/countReviews
                        const progressTwo = ratedTwo*100/countReviews 
                        const progressOne= ratedOne*100/countReviews
                        const avgRating = ((ratedFive*5+ratedFour*4+ratedThree*3+ratedTwo*2+ratedOne*1)/countReviews).toFixed(1)
                        return (
                          <div>
                          {smallViewSize ?
                          ( <GridContainer className={classes.paddingTLR}>
                                <GridItem xs={3} sm={2}>
                                <Box display="flex" justifyContent="center">
                                  <Box> <h1>{avgRating}</h1> </Box>
                                </Box>
                                </GridItem>
                                <GridItem xs={4} sm={3}>
                                <Box display="flex" justifyContent="center">
                                  <Box> <Rating value={avgRating} precision={0.1} readOnly/> </Box>
                                </Box>
                                <Box display="flex" justifyContent="center">
                                  <Box> <div>{countReviews} reviews</div> </Box>
                                </Box>
                                </GridItem>
                                <RateButton xs="5" sm="7" md="2"/>

                            <GridItem xs={12} sm={12} className={classes.marginLR}>
                            <RatingDistribution value="5" progress={progressFive} quantity={ratedFive} />
                            <RatingDistribution value="4" progress={progressFour} quantity={ratedFour} />
                            <RatingDistribution value="3" progress={progressThree} quantity={ratedThree} />
                            <RatingDistribution value="2" progress={progressTwo} quantity={ratedTwo} />
                            <RatingDistribution value="1" progress={progressOne} quantity={ratedOne} />
                            </GridItem>
                          </GridContainer>):

                          ( <GridContainer>
                            <GridItem sm={12} md={10} className={classNames(classes.paddingLR)}>
                              <p style={{fontSize:"18px", marginTop:"20px", color:"inherit"}}> Reviews</p>
                            </GridItem>
                            <RateButton sm="12" md="2"/>
      
                            <GridItem sm={12} md={4} className={classNames(classes.paddingLR)}>
                              <GridContainer>
                                <GridItem sm={2} md={12}>
                                <Box display="flex" justifyContent="center">
                                  <Box> <h1>{avgRating}</h1> </Box>
                                </Box>
                                </GridItem>
                                <GridItem sm={2} md={12}>
                                <Box display="flex" justifyContent="center">
                                  <Box> <Rating value={avgRating} precision={0.1} readOnly/> </Box>
                                </Box>
                                <Box display="flex" justifyContent="center">
                                  <Box> <div> {countReviews} reviews</div> </Box>
                                </Box>
                                </GridItem>
                              </GridContainer>
                            </GridItem>
                              
                            <GridItem sm={12} md={8}>
                            <RatingDistribution value="5" progress={progressFive} quantity={ratedFive} />
                            <RatingDistribution value="4" progress={progressFour} quantity={ratedFour} />
                            <RatingDistribution value="3" progress={progressThree} quantity={ratedThree} />
                            <RatingDistribution value="2" progress={progressTwo} quantity={ratedTwo} />
                            <RatingDistribution value="1" progress={progressOne} quantity={ratedOne} />                            </GridItem>
                          </GridContainer>)
                        }
                        </div>);
                        }}
                    </Query>
                  
                 
                  <GridContainer>                    
                    <GridItem md={12} sm={12} className={classNames(classes.paddingLR)}>
                      <Query query={REVIEW_QUERY} variables={{ id }}>
                        {({ data, loading, error }) => {
                        if (loading) return <div>Loading</div>;
                        if (error) return <div>Error</div>;
                        return <ReviewList reviews={data.reviews}/>;
                        }}
                      </Query>
                    </GridItem>
                    {/* <Button round color="rose">
                      Load more...
                    </Button> */}
                  </GridContainer>
                </div>
                </div>

                </div>
            );
        }}
        </Query>

            
        
    </div>
    );
};

const SELECTED_SALON_QUERY = gql`
query ($id:Int!) {
    salonSelected(id: $id) {
        id
        name
        address
        description
        city{
          title
        }
        rating
        priceRange
        photoMain
        photo1
        photo2
        photo3
        photo4
        photo5
        photo6
        hairserviceSet {
          title,
          price,
          promotionPrice,
          duration
        }
        nailsserviceSet {
          title,
          price,
          promotionPrice,
          duration
        }
        hairremovalserviceSet {
          title,
          price,
          promotionPrice,
          duration
        }
        makeupserviceSet {
          title,
          price,
          promotionPrice,
          duration
        }
        massageserviceSet {
          title,
          price,
          promotionPrice,
          duration
        }
    }
}
`;

const REVIEW_QUERY = gql`
query ($id:Int!) {
  reviews(id:$id){
    postedBy {
      username
    }
    rating
    question1
    question2
    question3
    question4
    question5
    comment
    postDate
    voteSet{
      isUseful
    }
  }
}
`;

export default SalonDetail;

