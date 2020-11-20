import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import UserMenu from './UserMenu';
import style from './style.module.scss';

const TopBar = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <div className={style.topbar}>
      <div className={style.info}>
        <span brand="brand">
          Saliva<b>Clear</b>™
        </span>
        <span description="description">Surveillance Pool Test Results</span>
      </div>
      <div className="">
        <UserMenu dispatch={dispatch} history={history} />
      </div>
    </div>
  );
};

export default TopBar;
