import Loader from 'components/layout/Loader';
import Layout from 'layouts';
import NotFoundPage from 'pages/system/404';
import React from 'react';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import Switch from 'react-router-transition-switch';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

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
    path: '/system/404',
    Component: loadable(() => import('pages/system/404')),
    exact: true,
  },
  {
    path: '/profile',
    Component: loadable(() => import('pages/Profile')),
    exact: true,
  },
  {
    path: '/barcode-lookup',
    Component: loadable(() => import('pages/Search')),
  },
  {
    path: '/pools',
    Component: loadable(() => import('pages/Pools')),
  },
  {
    path: '/session/:id',
    Component: loadable(() => import('pages/Scan')),
  },
  {
    path: '/pool-scans/:sessionId/:scanId',
    Component: loadable(() => import('pages/PoolScan')),
  },
  {
    path: '/pool-scans',
    Component: loadable(() => import('pages/ScanSessions')),
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
    path: '/intake-receipt-log',
    Component: loadable(() => import('pages/IntakeReceiptLog')),
  },
  {
    path: '/analysis-runs/:id/:type?',
    Component: loadable(() => import('pages/AnalysisRun')),
  },
  {
    path: '/analysis-runs',
    Component: loadable(() => import('pages/AnalysisRuns')),
  },
  {
    path: '/reflex-list/:sampleId',
    Component: loadable(() => import('pages/ReflexComparison')),
  },
  {
    path: '/reflex-list',
    Component: loadable(() => import('pages/ReflexList')),
  },
  {
    path: '/companies',
    Component: loadable(() => import('pages/Companies')),
    exact: true,
  },
  {
    path: '/companies/:id',
    Component: loadable(() => import('pages/Companies/Company')),
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
    path: '/generate-run',
    Component: loadable(() => import('pages/RunTemplate')),
  },
  {
    path: '/runs/:id',
    Component: loadable(() => import('pages/Runs/Run')),
  },
  {
    path: '/runs',
    Component: loadable(() => import('pages/Runs')),
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
                return <Redirect to="/intake-receipt-log" />;
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
