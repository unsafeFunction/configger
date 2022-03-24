import { Alert, Layout } from 'antd';
import classNames from 'classnames';
import MenuLeft from 'components/layout/MenuLeft';
import SubBar from 'components/layout/SubBar';
import TopBar from 'components/layout/TopBar';
import Drawer from 'components/widgets/Drawers';
import Modal from 'components/widgets/Modals';
import BackTop from 'components/layout/BackTop';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import actions from 'redux/user/actions';
import sessionActions from 'redux/scanSessions/actions';
import { RootState } from 'redux/reducers';
import { UserState, SettingState } from 'redux/storeTypes';

type AppProps = {
  children: React.ReactChild;
};

const AppLayout = ({ children }: AppProps) => {
  const dispatch = useDispatch();
  const settings = useSelector<RootState, SettingState>(
    (state) => state.settings,
  );
  const { role, profile } = useSelector<RootState, UserState>(
    (state) => state.user,
  );
  const {
    menuLayoutType,
    isContentNoMaxWidth,
    isAppMaxWidth,
    isGrayBackground,
    isSquaredBorders,
    isCardShadow,
    isBorderless,
    isTopbarFixed,
    isGrayTopbar,
  } = settings;

  const location = useLocation();

  useEffect(() => {
    dispatch({ type: actions.PROFILE_REQUEST });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: sessionActions.FETCH_SESSION_ID_REQUEST,
    });
  }, [location.pathname, dispatch]);

  return (
    <Layout
      className={classNames({
        air__layout__contentNoMaxWidth: isContentNoMaxWidth,
        air__layout__appMaxWidth: isAppMaxWidth,
        air__layout__grayBackground: isGrayBackground,
        air__layout__squaredBorders: isSquaredBorders,
        air__layout__cardsShadow: isCardShadow,
        air__layout__borderless: isBorderless,
      })}
    >
      {role === 'company-admin' && !profile?.phone_number && (
        <Alert
          message="Informational Notes!"
          description="Receive text message notifications for DETECTED pool results. Go to Profile and enter your mobile phone number to begin receiving text message notifications."
          type="warning"
          showIcon
          closable
        />
      )}
      {menuLayoutType === 'left' && <MenuLeft />}
      <Layout>
        <Layout.Header
          className={classNames('air__layout__header', {
            air__layout__fixedHeader: isTopbarFixed,
            air__layout__headerGray: isGrayTopbar,
          })}
        >
          <TopBar />
          <SubBar location={location} />
        </Layout.Header>
        <Layout.Content style={{ height: '100%', position: 'relative' }}>
          <BackTop />
          <div className="air__utils__content">{children}</div>
        </Layout.Content>
        <Modal />
        <Drawer />
      </Layout>
    </Layout>
  );
};

export default AppLayout;
