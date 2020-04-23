import React from 'react'
import { Route, Redirect, BrowserRouter } from 'react-router-dom'
// import { ConnectedRouter } from 'connected-react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import Switch from 'react-router-transition-switch'
import Loadable from 'react-loadable'
import { connect } from 'react-redux'

import Layout from 'layouts'
import Loader from 'components/layout/Loader'
import NotFoundPage from 'pages/system/404'

const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => <Loader />,
  })

const routes = [
  {
    path: '/dashboard',
    Component: loadable(() => import('pages/dashboard')),
    exact: true,
  },
  {
    path: '/system/login',
    Component: loadable(() => import('pages/system/login')),
    exact: true,
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
    path: '/campaigns',
    Component: loadable(() => import('pages/campaigns')),
    exact: true,
  },
  {
    path: '/campaigns/:id',
    Component: loadable(()=>import('pages/CampaignProfile')),
  }
]

const mapStateToProps = ({ settings }) => ({ settings })

@connect(mapStateToProps)
class Router extends React.Component {
  render() {
    const {
      // history,
      settings: { routerAnimation },
    } = this.props
    return (
      <BrowserRouter>
        <Layout>
          <Switch
            render={props => {
              const {
                children,
                location: { pathname },
              } = props
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
              )
            }}
          >
            <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
            {routes.map(({ path, Component, exact=false }) => (
              <Route path={path} key={path} exact={exact}>
                <Component />
              </Route>
            ))}
            <Route component={NotFoundPage} />
          </Switch>
        </Layout>
      </BrowserRouter>
    )
  }
}

export default Router
