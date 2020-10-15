import React from 'react';
import { ApolloConsumer, Query } from "@apollo/react-components";
import gql from "graphql-tag";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Hidden from "@material-ui/core/Hidden";

import withRoot from "./withRoot";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Salon from "./pages/Salon";
import SalonDetail from "./pages/SalonDetail";
import Partner from "./pages/Partner";
import CreateReview from "components/Review/CreateReview";
import CreateSalon from "components/Salon/CreateSalon";
import Privacy from "pages/Privacy"

import Navbar from "components/Partials/Navbar";
import MainFooter from "components/Partials/MainFooter"
import FooterMenu from "components/Partials/FooterMenu"
import Loading from "components/Shared/Loading";
import Error from "components/Shared/Error"
import Login from "components/Auth/Login"
import Auth from "components/Auth"
import Activate from "components/Auth/Activate"
import PasswordReset from "components/Auth/PasswordReset"
import SendPasswordReset from "components/Auth/SendPasswordReset"
import routes, { renderRoutes } from 'components/Partner/routes.js';

export const UserContext = React.createContext();

const App = () => (
  <Query query={ME_QUERY} fetchPolicy="cache-and-network">
    {({data, loading, error}) => {
      if (loading) return <Loading />;
      if (error) {
        return <Error error = {error} />
      };
      if (!data.me) { window.location.reload() }
      console.log('me query in index files',data);
      const currentUser = data.me;
      const {id} = currentUser;

      return (
        <Router>
          <UserContext.Provider value={currentUser}>
            <Navbar currentUser={currentUser} dropdownHoverColor="info" />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Auth} />
              <Route path="/activate/:token" component={Activate} />
              <Route path="/reset" component={SendPasswordReset} />
              <Route path="/password-reset/:token" component={PasswordReset} />
              <Route exact path="/salon" component={Salon} />
              <Route path="/profile/:id" component={Profile} />
              <Route path="/salon/:id" component={SalonDetail} />
              <Route path="/review/:id" component={CreateReview} />
              <Route exact path="/partner/:id" component={Partner} /> 
              <Route exact path="/privacy" component={Privacy} />

              {renderRoutes(routes)}
            </Switch>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <Hidden smDown implementation="css">
              <MainFooter currentUser={currentUser}/>
            </Hidden>
            <Hidden mdUp implementation="css">
              <FooterMenu currentUser={currentUser}/>
            </Hidden>
          </UserContext.Provider>
        </Router>
      );
    }}
  </Query>
);

export const ME_QUERY = gql`
  {
    me {
      id
      username
      email
      role
      dateJoined
      bookingSet {
        id
        serviceTitle
        servicePrice
        start
      } 
      salonSet{
        id
        name
        address
        masterSet {
          id
          masterName
          masterEmail
          masterPhone
          bookingSet {
            id
            customerName
            customerEmail
            serviceTitle
            start
            end
          }  
        }
        city {
          id
          title
        }
        area {
          id
          title
        }
        description
        rating
        priceRange
        photoMain
        photo1
        photo2
        photo3
        photo4
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
      }
    }
  }
`;

// export const SALON_QUERY = `
//   {
//     salons (search: "hair1"){
//       name
//       city {
//         title
//       }
//       address
//       hairCategories {
//         title
//       }
//     }
//   }
// `;


export default withRoot(App);
