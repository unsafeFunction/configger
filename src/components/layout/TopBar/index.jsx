import React from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import moment from 'moment-timezone';
import { Statistic } from 'antd';
import pulseCircle from 'components/widgets/Pools/PulseCircle/styles.module.scss';
import UserMenu from './UserMenu';
import styles from './style.module.scss';

const TopBar = () => {
  const { Countdown } = Statistic;
  const dispatch = useDispatch();
  const history = useHistory();
  const session = useSelector((state) => state.scanSessions.singleSession);
  const handleClickActiveSession = () => {
    history.push(`/session/${session.id}`);
  };
  const isActiveSession = session?.id;
  console.log(session);
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
          className={classNames(
            pulseCircle.circleWrapper,
            styles.activeWrapper,
          )}
          onClick={handleClickActiveSession}
        >
          <div className={pulseCircle.pulsatingCircle} />
          <Countdown
            className={styles.timer}
            title="Active session"
            // This one second needed to close session after 30 minutes. Because on 30:00 we can do smth, but on 30:01 - can't
            value={moment(session.started_on_day).add({
              minutes: 30,
              seconds: 1,
            })}
            format="mm:ss"
            onFinish={() => console.log('hehe')}
          />
        </div>
      )}
      <div>
        <UserMenu dispatch={dispatch} history={history} />
      </div>
    </div>
  );
};

export default TopBar;
