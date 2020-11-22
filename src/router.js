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
    path: '/timeline',
    Component: loadable(() => import('pages/timeline')),
    exact: true,
  },
  {
    path: '/system/login',
    Component: loadable(() => import('pages/system/login')),
    exact: true,
  },
  {
    path: '/system/restore-password',
    Component: loadable(() => import('pages/system/forgot-password')),
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
    path: '/customers',
    Component: loadable(() => import('pages/Customers')),
    exact: true,
  },
  {
    path: '/settings',
    Component: loadable(() => import('pages/Settings')),
    exact: true,
  },
  {
    path: '/conversations',
    Component: loadable(() => import('pages/messaging')),
    exact: true,
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
                console.log('here');
                return <Redirect to="/dashboard" />;
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
