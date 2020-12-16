import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import style from './style.module.scss';

const TopBar = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <div className={style.topbar}>
      <div className={style.info}>
        <Link to="/" className="mr-3">
          <img
            src="/resources/images/salivaclear.svg"
            alt="Saliva Clear"
            className={style.brand}
          />
        </Link>
        <span description="description" className="d-none d-sm-inline">
          Surveillance Pool Test Results
        </span>
      </div>
      <div>
        <UserMenu dispatch={dispatch} history={history} />
      </div>
    </div>
  );
};

export default TopBar;
