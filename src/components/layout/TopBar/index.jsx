/* eslint-disable prettier/prettier */
import React from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import moment from 'moment-timezone';
import { Statistic } from 'antd';
import sessionActions from 'redux/scanSessions/actions';
import UserMenu from './UserMenu';
import styles from './style.module.scss';

const TopBar = React.memo(() => {
  const { Countdown } = Statistic;
  const dispatch = useDispatch();
  const history = useHistory();
  const session = useSelector((state) => state.scanSessions.singleSession);
  const handleClickActiveSession = () => {
    history.push(`/session/${session.id}`);
  };
  const isActiveSession = session?.id;

  const onFinish = () => {
    dispatch({
      type: sessionActions.FETCH_SESSION_ID_REQUEST,
    });
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.info}>
        <Link to="/" className="mr-3">
          <img
            src="/resources/images/salivaclear.svg"
            alt="Saliva Clear"
            className={styles.brand}
          />
        </Link>
        <span description="description" className="d-none d-sm-inline">
          Surveillance Pool Test Results
        </span>
      </div>
      {isActiveSession && (
        <div
          role="presentation"
          className={classNames(styles.circleWrapper, styles.activeWrapper)}
          onClick={handleClickActiveSession}
        >
          <div className={styles.pulsatingCircle} />
          <Countdown
            className={styles.timer}
            title={
              <span>
                Active session for <b>{session.company_short.name}</b>
              </span>
            }
            valueStyle={{ fontSize: '1.2rem' }}
            value={moment(session.started_on_day).add({
              minutes: session.sessionLength || 30,
              seconds: 1,
            })}
            format="mm:ss"
            onFinish={onFinish}
          />
        </div>
      )}
      <div>
        <UserMenu dispatch={dispatch} history={history} />
      </div>
    </div>
  );
});

export default TopBar;
