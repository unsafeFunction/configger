/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable prettier/prettier */
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styles from './style.module.scss';
import UserMenu from './UserMenu';

const TopBar = React.memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();


  return (
    <div className={styles.topbar}>
      <div className={styles.info}>
        {/* <img
          src={`/resources/images/${process.env.REACT_APP_LAB_ID}.svg`}
          alt="Lab logo"
          className={styles.logo}
        /> */}
      </div>


      <div>
        <UserMenu dispatch={dispatch} history={history} />
      </div>
    </div>
  );
});

export default TopBar;
