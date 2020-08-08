import React from 'react';
import { ApolloConsumer, Query } from "@apollo/react-components";
import gql from "graphql-tag";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import withRoot from "./withRoot";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Salon from "./pages/Salon";
import SalonDetail from "./pages/SalonDetail";
import Partner from "./pages/Partner";
import CreateReview from "components/Review/CreateReview";

import Navbar from "./components/Partials/Navbar";
import MainFooter from "components/Partials/MainFooter"
import Loading from "./components/Shared/Loading";
import TokenError from "./components/Shared/TokenError";
import Error from "./components/Shared/Error"

export const UserContext = React.createContext();

const App = () => (
  <Query query={ME_QUERY} fetchPolicy="cache-and-network">
    {({data, loading, error}) => {
      if (loading) return <Loading />;
      if (error) {
        return <Error error = {error} />
        // return <TokenError />
      };
      const currentUser = data.me;

      return (
        <Router>
          <UserContext.Provider value={currentUser}>
            <Navbar currentUser={currentUser} dropdownHoverColor="info" />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/salon" component={Salon} />
              <Route path="/profile/:id" component={Profile} />
              <Route path="/salon/:id" component={SalonDetail} />
              <Route path="/review/:id" component={CreateReview} />
              <Route exact path="/partner" component={Partner} />
            </Switch>
            <MainFooter/>
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
    }
  }
`;

// export const SALON_QUERY = gql`
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
