import React, {
  Suspense,
  Fragment,
  lazy,
  useContext,
  useState
} from 'react';
import { Query } from "@apollo/react-components";
import {
  Switch,
  Redirect,
  Route
} from 'react-router-dom';
import Dashboard from 'components/Partner/Dashboard';
import LoadingScreen from 'components/Partials/LoadingScreen';

import PropTypes from 'prop-types'; 
import { makeStyles } from '@material-ui/core';
import NavBar from 'components/Partner/Dashboard/NavBar';
import TopBar from 'components/Partner/Dashboard/TopBar';

import Loading from "components/Shared/Loading";
import Error from "components/Shared/Error"
import { ME_QUERY } from "App"

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));

const DashboardLayout = ({ children }) => {
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <Query query={ME_QUERY} fetchPolicy="cache-and-network">
      {({data, loading, error}) => {
        if (loading) return <Loading />;
        if (error) {
          return <Error error = {error} />
        };
        const currentUser = data.me;
        console.log("inside Dashboard")

        return (
          <div className={classes.root}>
            <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} user={currentUser} />
            <NavBar
              onMobileClose={() => setMobileNavOpen(false)}
              openMobile={isMobileNavOpen}
              user={currentUser}
            />
            <div className={classes.wrapper}>
              <div className={classes.contentContainer}>
                <div className={classes.content}>
                  {children}
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Query>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node
};

export default DashboardLayout;

  





