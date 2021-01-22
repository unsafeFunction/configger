import React from 'react';
import { Route, Redirect, BrowserRouter } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Switch from 'react-router-transition-switch';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';

import Layout from 'layouts';
import Loader from 'components/layout/Loader';
import NotFoundPage from 'pages/system/404';

const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => <Loader />,
  });

const routes = [
  {
    path: '/results',
    Component: loadable(() => import('pages/timeline')),
    exact: true,
  },
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
    path: '/system/terms-and-conditions',
    Component: loadable(() => import('pages/system/terms-and-conditions')),
    exact: false,
  },
  {
    path: '/profile',
    Component: loadable(() => import('pages/profile')),
    exact: true,
  },
  {
    path: '/system/404',
    Component: loadable(() => import('pages/system/404')),
    exact: true,
  },
  {
    path: '/users',
    Component: loadable(() => import('pages/Customers')),
    exact: true,
  },
  {
    path: '/users/:userId',
    Component: loadable(() => import('pages/activityStream')),
  },
  {
    path: '/runs',
    Component: loadable(() => import('pages/runs')),
    exact: true,
  },
  {
    path: '/runs/:id',
    Component: loadable(() => import('pages/runs/run')),
  },
  {
    path: '/pools',
    Component: loadable(() => import('pages/Pools')),
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
  {
    path: '/packing-slip',
    Component: loadable(() => import('pages/Intake')),
  },
  {
    path: '/barcode-lookup',
    Component: loadable(() => import('pages/search')),
  },
  {
    path: '/intake',
    Component: loadable(() => import('pages/IntakeLims')),
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
            render={props => {
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
                return <Redirect to="/results" />;
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
