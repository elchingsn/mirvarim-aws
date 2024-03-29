import React, { useState } from 'react';
import { Query } from "@apollo/react-components";
// import {
//   Switch,
//   Redirect,
//   Route
// } from 'react-router-dom';

import PropTypes from 'prop-types'; 
import { makeStyles } from '@material-ui/core';
import NavBar from 'components/Partner/Dashboard/NavBar';
import TopBar from 'components/Partner/Dashboard/TopBar';

import Loading from "components/Shared/Loading";
import Error from "components/Shared/Error"
import { useTranslation } from 'react-i18next';

import { ME_QUERY } from "App"

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
// pick a date util library
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from "date-fns/locale/ru";
import enLocale from "date-fns/locale/en-GB";

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
  },
  paddingTLR: {
    paddingTop: "10px",
    paddingLeft: "20px",
    paddingRight: "20px"
  }
}));

const DashboardLayout = ({ children }) => {
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const { t } = useTranslation();

  const [locale, setLocale] = useState(localStorage.getItem("i18nextLng"))

  const localeMap = {
    aze: ruLocale,
    en: enLocale,
    ru: ruLocale,
  };

  return (
    <Query query={ME_QUERY} fetchPolicy="cache-and-network">
      {({data, loading, error}) => {
        if (loading) return <Loading />;
        if (error) {
          return <Error error = {error} />
        }
        const currentUser = data.me;

        if (currentUser.role === "A_1") {
          return <div style={{padding: "5px 5px"}}>{t("Please login as a salon or freelancer to add salon/service")}</div>
        } else return (
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[locale]}>
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
                    </MuiPickersUtilsProvider> 
                    );
      }}
    </Query>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node
};

export default DashboardLayout;

  





