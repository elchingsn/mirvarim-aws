import React, {
  Suspense,
  Fragment,
  lazy
} from 'react';
import {
  Switch,
  Route
} from 'react-router-dom';
import LoadingScreen from 'components/Partials/LoadingScreen';
import DashboardLayout from './Dashboard';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route, i) => {
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
                <Layout>
                  {route.routes
                    ? renderRoutes(route.routes)
                    : <Component {...props} />}
                </Layout>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

const routes = [
  {
    path: "/partner/:id",
    layout: DashboardLayout,
    routes: [
      {
        exact: true,
        path: "/partner/:id/salon/view",
        component: lazy(() => import('components/Salon/ViewSalon'))
      },      
      {
        exact: true,
        path: "/partner/:id/salon/create",
        component: lazy(() => import('components/Salon/CreateSalon'))
      },
      {
        exact: true,
        path: "/partner/:id/salon/edit",
        component: lazy(() => import('components/Salon/UpdateSalon'))
      },
      {
        exact: true,
        path: "/partner/:id/master/add",
        component: lazy(() => import('components/Master/AddMaster'))
      },
      {
        exact: true,
        path: "/partner/:id/master/edit",
        component: lazy(() => import('components/Master/UpdateMaster'))
      },
      {
        exact: true,
        path: "/partner/:id/report", 
        component: lazy(() => import('components/Partner/Dashboard/views/reports/ReportView'))
      },
      {
        exact: true,
        path: "/partner/:id/service/create",
        component: lazy(() => import('components/Service/CreateService')) 
      },
      {
        exact: true,
        path: "/partner/:id/calendar",
        component: lazy(() => import('components/Partner/Dashboard/views/calendar/CalendarView')) 
      },
      {
        exact: true,
        path: "/partner/:id/service/edit",
        component: lazy(() => import('components/Service/UpdateService'))
      },
      // {
      //   exact: true,
      //   path: "/partner/:id/service",
      //   component: lazy(() => import('components/Service'))
      // },
      // {
      //   exact: true,
      //   path: '/app/calendar',
      //   component: lazy(() => import(''))
      // },
      // {
      //   exact: true,
      //   path: `/partner/${userId}`,
      //   component: () => <Redirect to={`/partner/${userId}/reports/main`} />
      // },
      // {
      //   component: () => <Redirect to="/404" />
      // }
    ]
  }
]

export default routes;

