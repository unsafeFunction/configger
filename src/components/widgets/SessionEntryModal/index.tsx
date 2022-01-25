import React from 'react';
import { Checkbox } from 'antd';

import styles from './styles.module.scss';

const SessionEntryModal = (): JSX.Element => {
  return (
    <div className={styles.sessionInfoModal}>
      <b className={styles.title}>General info</b>
      <p>
        The session has a time limit set on the scanner. After the limit
        expires, the session will be closed, the time until the end of the
        session is in the upper right corner
      </p>
      <img
        src="https://qa.media.lims.mirimus.com/session-timeout.png"
        alt="session-timeout"
        className={styles.image}
      />
      <p>
        You can get visual information about the action you are about to perform
        by clicking on this button:
      </p>
      <img
        src="https://qa.media.lims.mirimus.com/tooltip.jpeg"
        alt="tips"
        className={styles.image}
      />
      <Checkbox className={styles.checkbox}>Don't show modal again</Checkbox>
    </div>
  );
};

export default SessionEntryModal;
