import Layout from 'layouts';
import NotFoundPage from 'pages/system/404';
import React from 'react';
import Loadable from 'react-loadable';
import { useSelector } from 'react-redux';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import labConfig from 'utils/labConfig';
import Switch from 'react-router-transition-switch';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import PageTitle from 'components/layout/PageTitle';
import Loader from 'components/layout/Loader';

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
    title: 'Login',
  },
  {
    path: '/system/registration',
    Component: loadable(() => import('pages/system/reg-by-email')),
    exact: true,
    title: 'Registration',
  },
  {
    path: '/system/forgot-password',
    Component: loadable(() => import('pages/system/forgot-password')),
    exact: false,
    title: 'Forgot Password',
  },
  {
    path: '/system/restore-password',
    Component: loadable(() => import('pages/system/restore-password')),
    exact: false,
    title: 'Restore Password',
  },
  {
    path: '/system/account-confirm-email',
    Component: loadable(() => import('pages/system/reg-by-email')),
    exact: false,
    title: 'Account Confirm Email',
  },
  {
    path: '/system/404',
    Component: loadable(() => import('pages/system/404')),
    exact: true,
    title: 'Not Found',
  },
  {
    path: '/profile',
    Component: loadable(() => import('pages/Profile')),
    exact: true,
  },
  {
    path: '/environments',
    Component: loadable(() => import('pages/Environments')),
  },
  // {
  //   path: '/projects',
  //   Component: loadable(() => import('pages/Environments')),
  // },
  // {
  //   path: '/projects/:id',
  //   Component: loadable(() => import('pages/Environments')),
  // },
];

const Router = () => {
  const settings = useSelector((state) => state.settings);
  const { routerAnimation } = settings;

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
          {routes.map(({ path, Component, exact = false, title }) => (
            <Route path={path} key={path} exact={exact}>
              <PageTitle title={title}>
                <Component />
              </PageTitle>
            </Route>
          ))}
          <Route component={NotFoundPage} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
};

export default Router;
