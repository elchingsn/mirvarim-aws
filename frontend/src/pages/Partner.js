import React from 'react';
//import { Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';
import ViewSalon from 'components/Salon/ViewSalon';
import DashboardLayout from 'components/Partner/Dashboard';

const Partner = ({ match })=>{
    //const id = match.params.id;
    //let { path, url } = useRouteMatch();
    
    React.useEffect(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
    });
    
 
      return (
        <DashboardLayout>
          <ViewSalon/>
        </DashboardLayout>
    );
}

export default Partner;