import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Avatar } from 'antd';
import { useSelector } from 'react-redux';
import styles from './style.module.scss';

const ProfileMenu = ({ dispatch, history }) => {
  const onLogout = useCallback(() => {
    dispatch({
      type: 'user/LOGOUT',
      payload: {
        redirect: () => history.push('/system/login'),
      },
    });
  }, [dispatch, history]);

  const onRedirectToProfile = useCallback(() => {
    history.push('/profile');
  }, [history]);

  const getInitials = (firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0).toUpperCase()}${lastName
        .charAt(0)
        .toUpperCase()}`;
    }

    return '';
  };

  const { first_name, last_name, role } = useSelector(
    state => state.user.profile,
  );

  const menu = (
    <Menu selectable={false}>
      <Menu.Item onClick={onRedirectToProfile}>
        {/* <strong className={styles.menu}>Hello, {first_name}</strong>
        <div>
          <strong>Role: {role}</strong>
        </div> */}
        <strong>Profile</strong>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <div role="presentation" onClick={onLogout}>
          <i className={`${styles.menuIcon} fe fe-log-out`} />
          Sign out
        </div>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <div className={styles.dropdown}>
        <div className={styles.userAvatar}>
          {getInitials(first_name, last_name)}
        </div>
      </div>
    </Dropdown>
  );
};

ProfileMenu.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default ProfileMenu;
