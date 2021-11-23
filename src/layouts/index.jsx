import React, { Fragment } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import NProgress from 'nprogress';
import { Helmet } from 'react-helmet';
import cookieStorage from 'utils/cookie';
import PublicLayout from './Public';
import AuthLayout from './Auth';
import AppLayout from './App';

const Layouts = {
  public: PublicLayout,
  auth: AuthLayout,
  app: AppLayout,
};

const cookie = cookieStorage();
@withRouter
@connect(({ user, timeline, menu }) => ({ user, timeline, menu }))
class Layout extends React.PureComponent {
  previousPath = '';

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    const { prevLocation } = prevProps;
    if (location !== prevLocation) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const {
      children,
      location: { pathname, search },
      menu: { rolePermissions },
      user,
    } = this.props;

    let authorizedToVisit = true;
    let defaultPath = '/';
    if (rolePermissions && user.role) {
      const userPermissions = rolePermissions[user.role];
      // e.g., from `/companies/${companyId}` path it extracts only `/companies` part
      const regEx = /^[/][^/]*/u;
      const mainPath = pathname.match(regEx)[0];
      authorizedToVisit = userPermissions.permitted.includes(mainPath);
      defaultPath = userPermissions.default;
    }

    // NProgress Management
    const currentPath = pathname + search;
    if (currentPath !== this.previousPath) {
      NProgress.start();
    }

    setTimeout(() => {
      NProgress.done();
      this.previousPath = currentPath;
    }, 300);

    // Layout Rendering
    const getLayout = () => {
      if (pathname === '/') {
        return 'public';
      }
      if (/^\/system(?=\/|$)/i.test(pathname)) {
        return 'auth';
      }
      return 'app';
    };

    const layoutType = getLayout();
    const Container = Layouts[layoutType];
    const isUserAuthorized = cookie.getItem('accessToken');
    const isAuthLayout = layoutType === 'auth';
    const BootstrappedLayout = () => {
      // show loader when user in check authorization process, not authorized yet and not on login pages
      // if (!isUserAuthorized && !isAuthLayout) {
      //   return <Loader />;
      // }
      // redirect to login page if current is not login page and user not authorized
      if (!isAuthLayout && !isUserAuthorized) {
        return <Redirect to="/system/login" />;
      }
      if (!isAuthLayout && !authorizedToVisit) {
        return <Redirect to={defaultPath} />;
      }
      // in other case render previously set layout
      return <Container>{children}</Container>;
    };

    return (
      <Fragment>
        <Helmet titleTemplate="LIMS" />
        {BootstrappedLayout()}
      </Fragment>
    );
  }
}

export default Layout;
