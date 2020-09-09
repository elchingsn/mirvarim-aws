import React from 'react';
import { ApolloConsumer, Query } from "@apollo/react-components";
import gql from "graphql-tag";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import Hidden from "@material-ui/core/Hidden";

import withRoot from "./withRoot";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Salon from "./pages/Salon";
import SalonDetail from "./pages/SalonDetail";
import Partner from "./pages/Partner";

import Navbar from "./components/Partials/Navbar";
import MainFooter from "components/Partials/MainFooter"
import FooterMenu from "components/Partials/FooterMenu"
import Loading from "./components/Shared/Loading";
import Error from "./components/Shared/Error";

import Login from "components/Auth/Login"
import Activate from "components/Auth/Activate"
import PasswordReset from "components/Auth/PasswordReset"

export const UserContext = React.createContext();

const App = () => (
  <Router>
    <UserContext.Provider>
      <Navbar dropdownHoverColor="info" />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route path="/activate/:token" component={Activate} />
        <Route path="/reset" component={PasswordReset} />
        <Route path="/reset/:token" component={PasswordReset} />
        <Route exact path="/salon" component={Salon} />
        {/* <Route path="/profile/:id" component={Profile} /> */}
        <Route path="/salon/:id" component={SalonDetail} />
        {/* redirects not matched routes to home */}
        {/* <Route render={() => <Redirect to="/" />} /> */}
      </Switch>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <Hidden smDown implementation="css">
        <MainFooter/>
      </Hidden>
      <Hidden mdUp implementation="css">
        <FooterMenu/>
      </Hidden>
    </UserContext.Provider>
  </Router>
);


export default withRoot(App);
