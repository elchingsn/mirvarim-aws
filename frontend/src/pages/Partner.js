import React, { useContext } from 'react';
//import { Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';
import ViewSalon from 'components/Salon/ViewSalon';
import DashboardLayout from 'components/Partner/Dashboard';
import { UserContext } from "App.js"
import { useTranslation } from 'react-i18next';

const Partner = ({ match })=>{
    //const id = match.params.id;
    //let { path, url } = useRouteMatch();
    const currentUser = useContext(UserContext);
    const { t } = useTranslation();

    React.useEffect(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
    },[]);
    
    console.log(currentUser)
    if (currentUser.role === "A_1") {
      return <div style={{padding: "5px 5px"}}>{t("Please login as a salon or freelancer to add salon/service")}</div>
    } else return (
                  <DashboardLayout>
                    <ViewSalon/>
                  </DashboardLayout>
                  );
}

export default Partner;