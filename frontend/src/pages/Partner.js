import React, { useContext, useState } from 'react';
import { Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';
import LoadingScreen from 'components/Partials/LoadingScreen';

import PropTypes from 'prop-types'; 
import { makeStyles } from '@material-ui/core';
import NavBar from 'components/Partner/Dashboard/NavBar';
import TopBar from 'components/Partner/Dashboard/TopBar';
import CreateSalon from 'components/Salon/CreateSalon'
import DashboardLayout from 'components/Partner/Dashboard';

const Partner = ({ match })=>{
    console.log(match);
    const id = match.params.id;
    let { path, url } = useRouteMatch();
    console.log(path, 'and', url)
    
    React.useEffect(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
    });
    
 
      return (
        <DashboardLayout/>
    );
}

export default Partner;