import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown } from 'antd';
import { useSelector } from 'react-redux';
import styles from './style.module.scss';

const ProfileMenu = ({ history }) => {
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

  const { first_name, last_name } = useSelector((state) => state.user.profile);

  const menu = (
    <Menu selectable={false}>
      <Menu.Item onClick={onRedirectToProfile}>
        <strong>Profile</strong>
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
  history: PropTypes.shape({}).isRequired,
};

export default ProfileMenu;
