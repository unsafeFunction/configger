import { Alert, Layout } from 'antd';
import classNames from 'classnames';
import MenuLeft from 'components/layout/MenuLeft';
import SubBar from 'components/layout/SubBar';
import TopBar from 'components/layout/TopBar';
import Drawer from 'components/widgets/Drawers';
import Modal from 'components/widgets/Modals';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import actions from 'redux/user/actions';
import styles from './styles.module.scss';

const AppLayout = (props) => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const { role, profile } = useSelector((state) => state.user);
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
  const { children } = props;

  const location = useLocation();

  useEffect(() => {
    dispatch({ type: actions.PROFILE_REQUEST });
  }, [dispatch]);

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
          className={styles.phoneWarning}
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
          <div className="air__utils__content">{children}</div>
        </Layout.Content>
        <Modal />
        <Drawer />
      </Layout>
    </Layout>
  );
};

export default AppLayout;
