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
import Privacy from "pages/Privacy"
import Contact from "pages/Contact"
import Pricing from "pages/Pricing"

import Navbar from "./components/Partials/Navbar";
import MainFooter from "components/Partials/MainFooter"
import FooterMenu from "components/Partials/FooterMenu"
import Loading from "./components/Shared/Loading";
import Error from "./components/Shared/Error";

import Login from "components/Auth/Login"
import Auth from "components/Auth"
import Auth_partner from "components/Auth_partner"
import Activate from "components/Auth/Activate"
import PasswordReset from "components/Auth/PasswordReset"
import SendPasswordReset from "components/Auth/SendPasswordReset"

export const UserContext = React.createContext();

const App = () => (
  <Router>
    <UserContext.Provider>
      <Navbar dropdownHoverColor="info" />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Auth} />
        <Route path="/activate/:token" component={Activate} />
        <Route path="/reset" component={SendPasswordReset} />
        <Route path="/partner" component={Auth_partner} />
        <Route path="/password-reset/:token" component={PasswordReset} />
        <Route exact path="/salon" component={Salon} />
        <Route path="/salon/:id" component={SalonDetail} />
        <Route exact path="/privacy" component={Privacy} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/pricing" component={Pricing} />
        {/* redirects not matched routes to home */}
        <Route render={() => <Redirect to="/" />} />
      </Switch>
      <Hidden smDown implementation="css">
        <MainFooter/>
      </Hidden>
      <Hidden mdUp implementation="css">
        <br/>
        <br/>
        <br/>        
        <br/>
        <FooterMenu/>
      </Hidden>
    </UserContext.Provider>
  </Router>
);


export default withRoot(App);
