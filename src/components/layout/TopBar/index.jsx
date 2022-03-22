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
    history.push(`/session/${session.activeSessionId}`);
  };
  const isActiveSession = session?.activeSessionId;
  const onFinish = () => {
    dispatch({
      type: sessionActions.FETCH_SESSION_ID_REQUEST,
      payload: {
        redirectCallback: () => {
          history.push('/intake-receipt-log');
        },
      },
    });
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.info}>
        <img
          src={`/resources/images/${process.env.REACT_APP_LAB_ID}.svg`}
          alt="Lab logo"
          className={styles.logo}
        />
        <Link className={styles.topMenuLink} to="/generate-run">
          Generate Run
        </Link>
        <Link className={styles.topMenuLink} to="/intake-receipt-log">
          Intake Receipt Log
        </Link>
        <Link className={styles.topMenuLink} to="/pool-scans">
          Pool Scans
        </Link>
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
                Active session for
                <b>{session.company_name}</b>
              </span>
            }
            valueStyle={{ fontSize: '1.2rem' }}
            value={moment(session.activeSessionStarted).add({
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
