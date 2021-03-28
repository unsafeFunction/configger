import React from 'react';
import { Route, Redirect, BrowserRouter } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Switch from 'react-router-transition-switch';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';

import Layout from 'layouts';
import Loader from 'components/layout/Loader';
import NotFoundPage from 'pages/system/404';

const loadable = (loader) =>
  Loadable({
    loader,
    delay: false,
    loading: () => <Loader />,
  });

const routes = [
  {
    path: '/system/login',
    Component: loadable(() => import('pages/system/login')),
    exact: true,
  },
  {
    path: '/system/forgot-password',
    Component: loadable(() => import('pages/system/forgot-password')),
    exact: false,
  },
  {
    path: '/system/restore-password',
    Component: loadable(() => import('pages/system/restore-password')),
    exact: false,
  },
  {
    path: '/system/account-confirm-email',
    Component: loadable(() => import('pages/system/reg-by-email')),
    exact: false,
  },
  {
    path: '/profile',
    Component: loadable(() => import('pages/Profile')),
    exact: true,
  },
  {
    path: '/system/404',
    Component: loadable(() => import('pages/system/404')),
    exact: true,
  },
  {
    path: '/packing-slip',
    Component: loadable(() => import('pages/Intake')),
  },
  {
    path: '/barcode-lookup',
    Component: loadable(() => import('pages/Search')),
  },
  {
    path: '/intake',
    Component: loadable(() => import('pages/IntakeLims')),
  },
  {
    path: '/pools',
    Component: loadable(() => import('pages/Pools')),
  },
  {
    path: '/runs',
    Component: loadable(() => import('pages/Runs')),
    exact: true,
  },
  {
    path: '/runs/:id',
    Component: loadable(() => import('pages/Runs/run')),
  },
  {
    path: '/pool-scans/:id',
    Component: loadable(() => import('pages/ScanPool')),
  },
  {
    path: '/rack-scans/:id',
    Component: loadable(() => import('pages/RackScan')),
  },
  {
    path: '/rack-scans',
    Component: loadable(() => import('pages/RackScans')),
  },
  {
    path: '/pool-scans',
    Component: loadable(() => import('pages/ScanSessions')),
  },
  {
    path: '/session/:id',
    Component: loadable(() => import('pages/Scan')),
  },
  {
    path: '/session',
    Component: loadable(() => import('pages/ScanSession')),
  },
  {
    path: '/intake-receipt-log',
    Component: loadable(() => import('pages/IntakeReceiptLog')),
  },
  {
    path: '/analysis-runs',
    Component: loadable(() => import('pages/AnalysisRuns')),
  },
  // {
  //   path: '/management',
  //   Component: loadable(() => import('pages/Management')),
  // },
  {
    path: '/inventory',
    Component: loadable(() => import('pages/Inventory')),
  },
  {
    path: '/run-creation',
    Component: loadable(() => import('pages/RunCreation')),
  },
  {
    path: '/settings/permission',
    Component: loadable(() => import('pages/Settings/Permissions')),
  },
];

const mapStateToProps = ({ settings }) => ({ settings });

@connect(mapStateToProps)
class Router extends React.Component {
  render() {
    const {
      settings: { routerAnimation },
    } = this.props;
    return (
      <BrowserRouter>
        <Layout>
          <Switch
            render={(props) => {
              const {
                children,
                location: { pathname },
              } = props;
              return (
                <SwitchTransition>
                  <CSSTransition
                    key={pathname}
                    classNames={routerAnimation}
                    timeout={routerAnimation === 'none' ? 0 : 300}
                  >
                    {children}
                  </CSSTransition>
                </SwitchTransition>
              );
            }}
          >
            <Route
              exact
              path="/"
              render={() => {
                return <Redirect to="/session" />;
              }}
            />
            {routes.map(({ path, Component, exact = false }) => (
              <Route path={path} key={path} exact={exact}>
                <Component />
              </Route>
            ))}
            <Route component={NotFoundPage} />
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default Router;
