import React, {useState, useEffect, useContext, useRef} from "react";
import {Link} from "react-router-dom";
import classNames from "classnames";
import ImageGallery from "react-image-gallery";
import { useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import {Query, Mutation} from "@apollo/react-components";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { makeStyles } from "@material-ui/core/styles";
import DateRangeIcon from '@material-ui/icons/DateRange';
import Rating from '@material-ui/lab/Rating';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Divider from '@material-ui/core/Divider';

import GridContainer from "../components/Partials/GridContainer.js";
import GridItem from "../components/Partials/GridItem.js";
import Button from "components/Partials/Button.js";
import Booking from "components/Partials/Booking.js";
import Accordion from "components/Partials/Accordion"

import Loading from "components/Shared/Loading";
import Error from "components/Shared/Error";
import Auth from "components/Auth"

//import Sticky from 'utils/sticky/Sticky.js';

import { UserContext } from "App";
import {PROFILE_QUERY} from "pages/Profile";

import styles from "assets/jss/salonDetailStyle.js";
import ReviewList from "components/Partials/ReviewList.js";
import CardFooter from "components/Partials/CardFooter.js";
import ShowMoreText from "utils/truncate/ShowMoreText.js";
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


const Service = ({title, duration, promotionPrice, price }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <CardFooter style={{paddingTop:"5px",paddingBottom:"10px",paddingLeft:"0px"}}>
        <>
        <div className={classes.priceContainer}>
          {t(`${title}`)}
        </div>
        <div style={{paddingLeft:"15px"}}>
          &nbsp;
          <i className="far fa-clock">&nbsp;{duration} {t("min")}</i>
        </div>
        <div className={classNames(classes.stats, classes.mlAuto)}>
          {promotionPrice ? (
          <>
          <span className={classNames(classes.priceOld)}>
            {" "}
            AZN {price}
          </span>
          <span className={classNames(classes.price, classes.priceNew)}>
            {" "}
            AZN {promotionPrice}
          </span>
          </> ) : (
          <span className={classNames(classes.price)}>
            {" "}
            AZN {price}
          </span>
          )}
        </div>
        </>
    </CardFooter>
  )
}  

const SalonDetail=({match}) => {

  // function queryReports() {
  //   gapi.client.request({
  //     path: '/v4/reports:batchGet',
  //     root: 'https://analyticsreporting.googleapis.com/',
  //     method: 'POST',
  //     body: {
  //       reportRequests: [
  //         {
  //           viewId: VIEW_ID,
  //           dateRanges: [
  //             {
  //               startDate: '7daysAgo',
  //               endDate: 'today'
  //             }
  //           ],
  //           metrics: [
  //             {
  //               expression: 'ga:sessions'
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   }).then(displayResults, console.error.bind(console));
  // }

  // function displayResults(response) {
  //   console.log('response',response);
  //   var formattedJson = JSON.stringify(response.result, null, 2);
  //   document.getElementById('query-output').value = formattedJson;
  // }

    const classes = useStyles();
    const currentUser = useContext(UserContext);
    const history = useHistory();
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    //const [colorSelect, setColorSelect] = useState("0");
    const [tabIndex, setTabIndex] = useState(0);
    const [smallViewSize, setSmallViewSize] = useState(true)
    const [isFavorite, setFavorite] = useState(false)
    const [likeId, setLikeId] = useState("")
    const [loadButton, setLoadButton] = useState(true)
    const [bookingDialog, setBookingDialog] = useState(false)
    const [salonRating, setSalonRating] = useState(0)
    const id = match.params.id;
    const API_BASE = `${process.env.REACT_APP_API_BASE}/media`;

    React.useEffect(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
      }, []);

    const [isSticky, setSticky] = React.useState(false);
    const stickyRef = useRef(null);
    const aboutRef = useRef(null);
    const servicesRef = useRef(null);
    const reviewRef = useRef(null);

    const { data: review_data, fetchMore } = useQuery(
      REVIEW_QUERY,
      {
        variables: {
          id,
          skip: 0,
          first: 5
        },
        fetchPolicy: "cache-and-network"
      }
    );

    const handleScroll = () => {
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
          break;
        default: handleScrollTo(aboutRef);            
      }
    };

    const handleScrollTo = (elRef) =>{
      const el = elRef.current ? elRef.current : elRef;
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    };

    const handleCreateLike = (createLike) =>{
      setFavorite(true);
      createLike({variables: {salonId: id}}).catch(err => {
        console.error(err);
        history.push('/login')
      });
    }

    const handleDeleteLike = (deleteLike) =>{
      setFavorite(false);
      deleteLike({variables: { likeId }}).catch(err => { 
        console.error(err);
        history.push('/login')
      });
    }

    // const handleUpdateCacheUp = (cache, { data: { createLike } }) => {
    //   const data = cache.readQuery({ query: SELECTED_SALON_QUERY });
    //   data.salonSelected[0].likeSet = [...data.salonSelected[0].likeSet, createLike.like];
    //   console.log('cache update',data.salonSelected[0].likeSet);
    //   cache.writeQuery({ query: SELECTED_SALON_QUERY}, data);
    // };

    const FavoriteButton = ({xs, sm, md}) => {
      return(
        <GridItem xs={xs} sm={sm} md={md} className={classNames(classes.floatRight)}>
          <Box display="flex" justifyContent="flex-end">
          <Box>
          {currentUser ? 
            (!isFavorite ? 
              ( 
                <Mutation
                  mutation={CREATE_LIKE}
                  // variables={{salonId: id}}
                  onCompleted={data => {
                    setLikeId(data.createLike.like.id);
                  }}
                  update={(cache, { data: { createLike } }) => {
                    //handleUpdateCacheUp(); 
                    const {salonSelected} = cache.readQuery({ query: SELECTED_SALON_QUERY, variables: {id} });
                    salonSelected[0].likeSet = [...salonSelected[0].likeSet, createLike.like];
                    cache.writeQuery({ query: SELECTED_SALON_QUERY, variables: {id}, data: {salonSelected} });              
                  }}
                  refetchQueries={() => [{ query: PROFILE_QUERY, variables: {id:currentUser.id} }]}
                >
                  {(createLike, { loading, error }) => {
                  if (error) return <Error error={error} />;
                    return(
                      <Button 
                        color="info" 
                        size="lg" 
                        simple
                        onClick={() => handleCreateLike(createLike)}
                        className={`${smallViewSize? "classes.floatright" : "classes.right"}`}>
                        <FavoriteIcon color="disabled"/>
                      </Button>
                    );
                  }}
                </Mutation>   
              ):
              (<Mutation
                mutation={DELETE_LIKE}
                // onCompleted={data => {
                //   console.log(data)
                // }}
                update={(cache, { data: { deleteLike } }) => {
                  const {salonSelected} = cache.readQuery({ query: SELECTED_SALON_QUERY, variables: {id} });
                  salonSelected[0].likeSet = salonSelected[0].likeSet.filter(({id}) => id != deleteLike.likeId);
                  //console.log('cache update',salonSelected);
                  cache.writeQuery({ query: SELECTED_SALON_QUERY, variables: {id}, data: {salonSelected} });              
                }}
                refetchQueries={() => [{ query: PROFILE_QUERY, variables: {id:currentUser.id} }]}

              >
                {(deleteLike, { loading, error }) => {
                if (error) return <Error error={error} />;
                  return(
                    <Button 
                      color="info" 
                      size="lg" 
                      simple
                      onClick={() => handleDeleteLike(deleteLike)}
                      className={`${smallViewSize? "classes.floatright" : "classes.right"}`}>
                      <FavoriteIcon color="error"/>
                    </Button>
                  );
                }}
              </Mutation>))
          : (<div>
              <Button 
                onClick={() => setOpen(true)} 
                color="info" 
                size="lg" 
                simple
                className={`${smallViewSize? "classes.floatright" : "classes.right"}`}>  
                  {isFavorite ? 
                  (<FavoriteIcon color="error" />) :
                  (<FavoriteIcon/>)}
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
                <span> {t("Rate")} </span>
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
                  <span> {t("Rate")} </span>
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

    const plural = (n) => {
      //find correct suffix in plural translation
      if (n%10==1) return 0 
      else if (n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20)) return 1 
      else return 2
    }
    
    return (
    <div>
        <Query query={SELECTED_SALON_QUERY} variables={{ id }}>
        {({ data, loading, error }) => {
            if (loading) return <Loading />;
            if (error) return <Error error={error} />;
            if ((currentUser) && (data.salonSelected[0].likeSet[0])){
              data.salonSelected[0].likeSet.map(node => {
                if (currentUser.email === node.likedBy.email) {
                  if(!likeId) {
                    setFavorite(true);
                    setLikeId(node.id);
                  }
                }
              })
            } 
            //console.log('data',data)
            const salon = data.salonSelected[0];
            const hairServices = salon.hairserviceSet
            const nailsServices = salon.nailsserviceSet
            const hairRemovalServices = salon.hairremovalserviceSet 
            const makeupServices = salon.makeupserviceSet
            const massageServices = salon.massageserviceSet
            const eyebrowServices = salon.eyebrowserviceSet
            const cosmetologyServices = salon.cosmetologyserviceSet
            const tattooServices = salon.tattooserviceSet
            const aestheticsServices = salon.aestheticsserviceSet
            const services = [...hairServices, ...nailsServices, ...hairRemovalServices, ...makeupServices, ...massageServices,
                              ...eyebrowServices, ...cosmetologyServices, ...tattooServices, ...aestheticsServices]   

            //const cosmetology_diff = salon.cosmetologyCategories.map(el => el.title).filter(x => !cosmetologyServices.map(el => el.title).includes(x))

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

            for (let i=1; i<numImages; i++){
                const photo = _images[i];
                let src = `${API_BASE}/${photo}`;
                images.push(
                    { original: src,
                    thumbnail: src,
                    }
                );
            }

            return (
            <div className={classNames(classes.section, classes.sectionGray)}>
              <div className={classes.container}>
                <div className={classNames(classes.main, classes.mainRaised)}>
                    {smallViewSize? 
                      (<GridContainer>
                        <GridItem xs={12} sm={12} className={classes.paddingTLR}>
                            <ImageGallery
                            showFullscreenButton={true}
                            showPlayButton={false}      
                            startIndex={0}
                            items={images}
                            />
                        </GridItem>
                        <GridItem xs={10} sm={10} className={classes.paddingL}>
                          <h2 className={classes.title}>{salon.name}</h2>
                          <h5>{salon.address}</h5>
                          <h5>{salon.email}</h5>
                          <h5>{salon.phone}</h5>
                      </GridItem>
                      <FavoriteButton xs="2" sm="2" md="2"/>
                          <GridItem md={6} sm={6} xs={6} className={classes.paddingL}>
                              <Rating name="read-only" size="small" value={salonRating} precision={0.1} readOnly />
                              <Link onClick={()=> handleScrollTo(reviewRef)}>
                                <h5>{t("View all reviews")}</h5>
                              </Link>
                            </GridItem>

                            {salon.appointment && services.length > 0 &&
                            <GridItem md={6} sm={6} xs={6} className={classes.pullRight}>
                              {currentUser
                                ? (<div>
                                    <Button 
                                      color="primary"
                                      size="sm"
                                      round
                                      onClick={() => setBookingDialog(true)}
                                    >
                                        {t("Book")} &nbsp; <DateRangeIcon />
                                    </Button>
                                      <Dialog
                                        fullScreen
                                        open={bookingDialog}
                                        onClose={() => setBookingDialog(false)}
                                        //aria-labelledby="alert-dialog-title" 
                                        //aria-describedby="alert-dialog-description"
                                      >
                                        <Booking 
                                          services={services} 
                                          salon={salon} 
                                          currentUser={currentUser} 
                                          setBookingDialog={setBookingDialog}
                                        />
                                      </Dialog>
                                  </div>)
                                : (<div>
                                  <Button 
                                    color="primary"
                                    size="sm"
                                    round
                                    onClick={() => setOpen(true)}
                                  >
                                      {t("Book")} &nbsp; <DateRangeIcon />
                                  </Button>
                                  <Dialog
                                    open={bookingDialog}
                                    onClose={() => setOpen(false)}
                                    //aria-labelledby="alert-dialog-title" 
                                    //aria-describedby="alert-dialog-description"
                                  >
                                    <Auth/>
                                  </Dialog>
                                </div>)
                                }
                          </GridItem> 
                          }
                          </GridContainer> ):
                  (<GridContainer>
                  <GridItem md={7} sm={7} className={classes.paddingTLR}>
                    <ImageGallery
                    showFullscreenButton={true}
                    showPlayButton={false}      
                    startIndex={0}
                    items={images}
                    />
                </GridItem>
                <GridItem md={4} sm={4} className={classes.paddingL}>
                    <h2 className={classes.title}>{salon.name}</h2>
                    <h5>{salon.address}</h5>
                    <GridContainer className={classes.pickSize}>

                    <GridItem md={6} sm={6}>
                        <Rating name="read-only" size="small" value={salonRating} precision={0.1} readOnly />
                        <Link onClick={()=> handleScrollTo(reviewRef)}>
                          <h5>{t("View all reviews")}</h5>
                        </Link>
                      </GridItem>
                    {salon.appointment && services.length > 0 &&
                    <GridItem md={6} sm={6} className={classes.pullRight}>
                      {currentUser
                        ? (<div>
                            <Button 
                              color="primary"
                              round
                              size="sm"
                              onClick={() => setBookingDialog(true)}
                            >
                                {t("Book")} &nbsp; <DateRangeIcon />
                            </Button>
                              <Dialog
                                open={bookingDialog}
                                onClose={() => setBookingDialog(false)}
                                //aria-labelledby="alert-dialog-title" 
                                //aria-describedby="alert-dialog-description"
                              >
                                <Booking 
                                  services={services} 
                                  salon={salon} 
                                  currentUser={currentUser} 
                                  setBookingDialog={setBookingDialog}
                                />
                              </Dialog>
                          </div>)
                        : (<div>
                          <Button 
                            color="primary"
                            round
                            size="sm"
                            onClick={() => setOpen(true)}
                          >
                              {t("Book")} &nbsp; <DateRangeIcon />
                          </Button>
                          <Dialog
                            open={bookingDialog}
                            onClose={() => setOpen(false)}
                            //aria-labelledby="alert-dialog-title" 
                            //aria-describedby="alert-dialog-description"
                          >
                            <Auth/>
                          </Dialog>
                        </div>)
                        }
                  </GridItem> 
                  }
                  </GridContainer>
                </GridItem>
                <FavoriteButton xs="2" sm="1" md="1"/>
                </GridContainer>
              )}
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
                        <Tab label={t("About")} />
                        <Tab label={t("Services")} />
                        <Tab label={t("Reviews")} />
                    </Tabs>
                  </nav>
                  <GridContainer>
                    <GridItem md={12} sm={12} className={classNames(classes.paddingLR, classes.paddingT)}>
                      <p style={{fontSize:"18px", marginTop:"30px", color:"inherit"}}>{t("About")}</p>
                      <ShowMoreText>
                        {salon.description} 
                      </ShowMoreText>
                    </GridItem>
                  </GridContainer>
                  </div>

                  <div className={classNames(classes.tab, classes.mainRaised)} ref={servicesRef}>
                  <GridContainer>
                    <GridItem md={12} sm={12} className={classNames(classes.paddingLR,classes.paddingT)}>
                    <p style={{fontSize:"18px", color:"inherit"}}>{t("Services")}</p>
                      {hairServices[0] && (
                        <Accordion title={t("Hair Services")}>
                          {hairServices.map(service => (
                            <div key={service.id}>
                            <Service 
                              title={service.title} 
                              duration={service.duration} 
                              price={service.price} 
                              promotionPrice={service.promotionPrice} />
                            <Divider />
                            </div> 
                          ))}
                        </Accordion>
                      )}
                      {nailsServices[0] && (
                        <Accordion title={t("Nails Services")}>
                          {nailsServices.map(service => (
                            <div key={service.id}>
                            <Service 
                              title={service.title} 
                              duration={service.duration} 
                              price={service.price} 
                              promotionPrice={service.promotionPrice} />
                            <Divider />
                            </div> 
                          ))}
                        </Accordion>
                      )}
                      {hairRemovalServices[0] && (
                        <Accordion title={t("Hair Removal Services")}>
                          {hairRemovalServices.map(service => (
                            <div key={service.id}>
                            <Service 
                              title={service.title} 
                              duration={service.duration} 
                              price={service.price} 
                              promotionPrice={service.promotionPrice} />
                            <Divider />
                            </div> 
                          ))}
                        </Accordion>
                      )}                                            
                      {makeupServices[0] && (
                        <Accordion title={t("Makeup Services")}>
                          {makeupServices.map(service => (
                            <div key={service.id}>
                            <Service 
                              title={service.title} 
                              duration={service.duration} 
                              price={service.price} 
                              promotionPrice={service.promotionPrice} />
                            <Divider />
                            </div> 
                          ))}
                        </Accordion>
                      )}
                      {massageServices[0] && (
                        <Accordion title={t("Massage/Spa Services")}>
                          {massageServices.map(service => (
                            <div key={service.id}>
                            <Service 
                              title={service.title} 
                              duration={service.duration} 
                              price={service.price} 
                              promotionPrice={service.promotionPrice} />
                            <Divider />
                            </div> 
                          ))}
                        </Accordion>
                      )}    
                      {eyebrowServices[0] && (
                        <Accordion title={t("Eyebrow Services")}>
                          {eyebrowServices.map(service => (
                            <div key={service.id}>
                            <Service 
                              title={service.title} 
                              duration={service.duration} 
                              price={service.price} 
                              promotionPrice={service.promotionPrice} />
                            <Divider />
                            </div> 
                          ))}
                        </Accordion>
                      )}  
                      {salon.cosmetologyCategories[0] && (
                        <Accordion title={t("Cosmetology Services")}>
                          {/* {cosmetology_diff.map(service => (
                            <div key={service}>
                              <CardFooter style={{paddingTop:"5px",paddingBottom:"10px",paddingLeft:"0px"}}>
                                <div className={classes.priceContainer}>
                                  {t(`${service}`)}
                                </div>
                              </CardFooter>
                              <Divider />
                            </div> 
                          ))} */}
                          {cosmetologyServices.map(service => (
                            <div key={service.id}>
                            <Service 
                              title={service.title} 
                              duration={service.duration} 
                              price={service.price} 
                              promotionPrice={service.promotionPrice} />
                            <Divider />
                            </div> 
                          ))}
                        </Accordion>
                      )}  
                      {tattooServices[0] && (
                        <Accordion title={t("Tattoo/Piercing Services")}>
                          {tattooServices.map(service => (
                            <div key={service.id}>
                            <Service 
                              title={service.title} 
                              duration={service.duration} 
                              price={service.price} 
                              promotionPrice={service.promotionPrice} />
                            <Divider />
                            </div> 
                          ))}
                        </Accordion>
                      )}  
                      {aestheticsServices[0] && (
                        <Accordion title={t("Aesthetics Services")}>
                          {aestheticsServices.map(service => (
                            <div key={service.id}>
                            <Service 
                              title={service.title} 
                              duration={service.duration} 
                              price={service.price} 
                              promotionPrice={service.promotionPrice} />
                            <Divider />
                            </div> 
                          ))}
                        </Accordion>
                      )}                                                                                                            
                      {/* <div>
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
                    </div> */}
            
                    </GridItem>
                  </GridContainer>
                  </div>

                  <div className={classNames(classes.tab, classes.mainRaised)} ref={reviewRef}>
                    <Query query={REVIEW_QUERY} variables={{ id }}>
                        {({ data, loading, error }) => {
                        if (loading) return <div>Loading</div>;
                        if (error) return <div>Error</div>;
                        // calculations on data returned from query
                        // if (data.reviews.length >5 ) {setLoadButton(true)}
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
                        setSalonRating(avgRating)
                        return (
                          <div>
                          {smallViewSize ?
                          ( <GridContainer className={classes.paddingTLR}>
                             {(Number.isNaN(parseFloat(avgRating))) ? (
                              <GridItem xs={7} sm={7}>
                              <Box display="flex" justifyContent="center">
                                <Box> <Rating value={avgRating} precision={0.1} readOnly/> </Box>
                              </Box>
                              <Box display="flex" justifyContent="center">
                                {/* <Box> <div>{countReviews} {t("reviews")}</div> </Box> */}
                                <Box> <div>{t("No review")}</div> </Box>
                              </Box>
                              </GridItem>
                              ) : (
                                <GridItem xs={7} sm={7}>
                                  <GridItem xs={6} sm={6}>
                                  <Box display="flex" justifyContent="center">
                                    <Box> <h1>{avgRating}</h1> </Box>
                                  </Box>
                                  </GridItem>
                                  <GridItem xs={6} sm={6}>
                                  <Box display="flex" justifyContent="center">
                                    <Box> <Rating value={avgRating} precision={0.1} readOnly/> </Box>
                                  </Box>
                                  <Box display="flex" justifyContent="center">
                                  {countReviews} {t(`review_${plural(countReviews)}`)}
                                  </Box>
                                  </GridItem>
                                </GridItem>
                              )}

                            <RateButton xs="5" sm="5" md="2"/>

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
                              <p style={{fontSize:"18px", marginTop:"20px", color:"inherit"}}> {t("Reviews")}</p>
                            </GridItem>
                            <RateButton sm="12" md="2"/>
      
                            <GridItem sm={12} md={4} className={classNames(classes.paddingLR)}>
                              <GridContainer>
                                <GridItem sm={2} md={12}>
                                  <br/>
                                  { (!Number.isNaN(parseFloat(avgRating))) && (
                                      <Box display="flex" justifyContent="center">
                                        <Box> <h1>{avgRating}</h1> </Box>
                                      </Box>
                                  )}
                                </GridItem>
                                <GridItem sm={2} md={12}>
                                <Box display="flex" justifyContent="center">
                                  <Box> <Rating value={avgRating} precision={0.1} readOnly/> </Box>
                                </Box>
                                { Number.isNaN(parseFloat(avgRating)) ? 
                                (<Box display="flex" justifyContent="center">
                                  <Box> <div>{t("No review")}</div> </Box>
                                 </Box>) :
                                 (<Box display="flex" justifyContent="center">
                                 <Box> 
                                 {/* {countReviews} {t("review",{count: {countReviews}})} */}
                                  {countReviews} {t(`review_${plural(countReviews)}`)}
                                </Box>
                                </Box>)
                                }
                                </GridItem>
                              </GridContainer>
                            </GridItem>
                              
                            <GridItem sm={12} md={6}>
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
                  
                 
                  {/* <GridContainer>                    
                    <GridItem md={12} sm={12} className={classNames(classes.paddingLR)}>
                      <Query query={REVIEW_QUERY} variables={{ id, first:3, skip:0 }}>
                        {({ data, loading, error }) => {
                        if (loading) return <div>Loading</div>;
                        if (error) return <div>Error</div>;
                        return <ReviewList reviews={data.reviews}/>;
                        }}
                      </Query>
                    </GridItem>
                  </GridContainer> */}
                  
                  {review_data  &&
                  (<GridContainer>                    
                    <GridItem md={12} sm={12} className={classNames(classes.paddingLR)}>
                        <ReviewList 
                          reviews={review_data.reviews||[]}
                          currentUser={currentUser}
                        />
                        { loadButton && (review_data.reviews.length > 4) && (
                        <Button  
                          round 
                          simple 
                          size="small"
                          color="rose"
                          onClick={()=>
                            fetchMore({
                              variables:{
                                skip: review_data.reviews.length
                              },
                              updateQuery: (prev, {fetchMoreResult}) => {
                                if (fetchMoreResult.reviews.length === 0) {
                                  setLoadButton(false)
                                  return prev
                                }
                                return Object.assign({}, prev, {
                                  reviews: [...prev.reviews, ...fetchMoreResult.reviews]
                                });
                              }
                            })
                          }
                        >
                          Load more...
                        </Button>)}
                    </GridItem>
                  </GridContainer>)}
                </div>
                </div>

                </div>
            );
        }}
        </Query>

            
        
    </div>
    );
};

export const SELECTED_SALON_QUERY = gql`
query selected_salon ($id:Int!) {
    salonSelected(id:$id) {
        id
        name
        address
        description
        email
        phone
        city{
          id
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
        isFeatured
        isPublished
        payment
        appointment
        createdBy {
          id 
          role
        }
        hairCategories {
          id
          title
        }
        nailsCategories {
          id
          title
        }
        hairRemovalCategories {
          id
          title
        }
        makeupCategories {
          id
          title
        }
        massageCategories {
          id
          title
        }
        eyebrowCategories {
          id
          title
        }
        cosmetologyCategories {
          id
          title
        }
        tattooCategories {
          id
          title
        }
        aestheticsCategories {
          id
          title
        }
        hairserviceSet {
          id
          title
          price
          promotionPrice
          duration
        }
        nailsserviceSet {
          id
          title
          price
          promotionPrice
          duration
        }
        hairremovalserviceSet {
          id
          title
          price
          promotionPrice
          duration
        }
        makeupserviceSet {
          id
          title
          price
          promotionPrice
          duration
        }
        massageserviceSet {
          id
          title
          price
          promotionPrice
          duration 
        }
        eyebrowserviceSet {
          id
          title
          price
          promotionPrice
          duration
        }     
        cosmetologyserviceSet {
          id
          title
          price
          promotionPrice
          duration
        }
        tattooserviceSet { 
          id
          title
          price
          promotionPrice
          duration
        }
        aestheticsserviceSet {
          id
          title
          price
          promotionPrice
          duration
        }       
        masterSet {
          id
          masterName
          masterEmail
          masterPhone
          isStaff
          staffStatus
          mondayHours
          tuesdayHours
          wednesdayHours
          thursdayHours
          fridayHours
          saturdayHours
          sundayHours
          bookingSet {
            id
            customerName
            customerEmail
            serviceTitle
            start
            end
          }  
        }
        likeSet {
          id
          salon {
            id
            name
          }
          likedBy {
            id
            username
            email
          }
        }
    }
}
`;

export const REVIEW_QUERY = gql`
query salon_review ($id:Int!, $first:Int, $skip:Int) {
  reviews(id:$id, first:$first, skip:$skip){
    id
    salon{
      id
      name
    }
    postedBy {
      id
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
      id
      votedBy{
        id 
        email
      }
      isUseful
      isReported
    }
  }
}
`;

const CREATE_LIKE = gql`
  mutation($salonId: Int!) {
    createLike(salonId: $salonId) {
      like {
        id
        salon {
          id
          name
        }
        likedBy {
          id
          username
          email
        }
      }
    }
  }
`;

const DELETE_LIKE = gql`
  mutation($likeId: Int!) {
    deleteLike(likeId: $likeId) {
      likeId
    }
  }
`;
export default SalonDetail;

