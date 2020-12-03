import React, {useState, useContext, useRef} from "react";
import classNames from "classnames";
import { useHistory } from 'react-router-dom';

import {Query} from "@apollo/react-components";
//import { ApolloProvider, useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { makeStyles } from "@material-ui/core/styles";

import Divider from '@material-ui/core/Divider';

import GridContainer from "components/Partials/GridContainer.js";
import GridItem from "components/Partials/GridItem.js";

import Loading from "components/Shared/Loading";
import Error from "components/Shared/Error";

import { UserContext, ME_QUERY } from "App";

import styles from "assets/jss/salonDetailStyle.js";
import CardFooter from "components/Partials/CardFooter.js";
import ShowMoreText from "utils/truncate/ShowMoreText.js";
import Accordion from "components/Partials/Accordion"

const useStyles = makeStyles(styles);

const Service = ({title, duration, promotionPrice, price }) => {
  const classes = useStyles();

  return (
    <CardFooter style={{paddingTop:"5px",paddingBottom:"10px",paddingLeft:"0px"}}>
        <>
        <div className={classes.priceContainer}>
          {title}
        </div>
        <div style={{paddingLeft:"15px"}}>
          &nbsp;
          <i className="far fa-clock">&nbsp;{duration} min</i>
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

const ViewService=() => {
    const classes = useStyles();
    const currentUser = useContext(UserContext);
    const id = currentUser.salonSet[0].id;
    const history = useHistory();

    // const { isSticky, element } = Sticky()

    React.useEffect(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
      }, []);


    return (
    <div>
        <Query query={SELECTED_SALON_QUERY} variables={{ id }}>
        {({ data, loading, error }) => {
            if (loading) return <Loading />;
            if (error) return <Error error={error} />;

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
            

          return (
            <div className={classes.section}>
                <div className={classes.container} >
                  <div className={classNames(classes.tab, classes.mainRaised)}>
                  <GridContainer>
                    <GridItem md={12} sm={12} className={classNames(classes.paddingLR,classes.paddingT)}>
                    <p style={{fontSize:"18px", color:"inherit"}}>Services</p>
                    {hairServices[0] && (
                      <Accordion title="Hair Services">
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
                      <Accordion title="Nails Services">
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
                      <Accordion title="Hair Removal Services">
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
                      <Accordion title="Makeup Services">
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
                      <Accordion title="Massage Services">
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
                    </GridItem>          
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
query selected_salon ($id:Int!) {
    salonSelected(id:$id) {
        id
        name
        address
        description
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

const REVIEW_QUERY = gql`
query salon_review ($id:Int!, $first:Int, $skip:Int) {
  reviews(id:$id, first:$first, skip:$skip){
    id
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
      isUseful
    }
  }
}
`;

export default ViewService;

