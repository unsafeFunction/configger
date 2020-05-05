import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Avatar } from 'antd';
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

  const menu = (
    <Menu selectable={false}>
      <Menu.Item>
        <strong>Hello, Anonymous</strong>
        <div>
          <strong className="mr-1">Billing Plan: </strong>
          Professional
        </div>
        <div>
          <strong>Role: Administrator </strong>
        </div>
      </Menu.Item>

      <Menu.Divider />
      <Menu.Item>
        <div role="presentation" onClick={onLogout}>
          <i className={`${styles.menuIcon} fe fe-log-out`} />
          Logout
        </div>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <div className={styles.dropdown}>
        <Avatar
          className={styles.avatar}
          shape="square"
          size="large"
          icon="user"
        />
      </div>
    </Dropdown>
  );
};

ProfileMenu.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default ProfileMenu;
