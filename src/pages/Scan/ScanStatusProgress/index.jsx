import { Progress } from 'antd';
import React from 'react';
import { constants } from 'utils/constants';
import { getScanStatusText } from 'utils/highlighting';
import styles from './styles.module.scss';

const ScanStatusProgress = ({ status }) => {
  const { started } = constants.scanStatuses;
  const progressWidth = 100;
  const percent = status === started ? 50 : 100;

  return (
    <Progress
      type="circle"
      percent={percent}
      width={progressWidth}
      format={(_) => (
        <p className={styles.progressTitle}>
          {getScanStatusText(status).toUpperCase()}
        </p>
      )}
    />
  );
};

export default ScanStatusProgress;
