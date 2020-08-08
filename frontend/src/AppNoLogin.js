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

import Navbar from "./components/Partials/Navbar";
import MainFooter from "components/Partials/MainFooter"
import Loading from "./components/Shared/Loading";
import Error from "./components/Shared/Error";

export const UserContext = React.createContext();

const App = () => (
  <Router>
    <UserContext.Provider>
      <Navbar dropdownHoverColor="info" />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/salon" component={Salon} />
        <Route path="/profile/:id" component={Profile} />
        <Route path="/salon/:id" component={SalonDetail} />
        <Route exact path="/partner" component={Partner} />
      </Switch>
      <MainFooter/>
    </UserContext.Provider>
  </Router>
);


export default withRoot(App);
