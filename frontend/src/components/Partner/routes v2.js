import React, {
  Suspense,
  Fragment,
  lazy,
  useContext
} from 'react';
import {
  Switch,
  Redirect,
  Route
} from 'react-router-dom';
import LoadingScreen from 'components/Partials/LoadingScreen';
import Partner from 'pages/Partner.js';

export const renderRoutes = (routes) => {
      return(
        <>
        {routes.map((route, i) => {
        const Component = route.component;
        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
                    <Partner>
                      <Component {...props} />
                    </Partner>
            )}
          />
        );
      })}
      </>
      )
}


const routes = [

      {
        exact: true,
        path: "/partner/:id/salon/create",
        component: lazy(() => import('components/Salon/CreateSalon'))
      }
]

export default routes;

