import React from 'react';
import { Progress } from 'antd';
import styles from './styles.module.scss';
import { constants } from 'utils/constants';

const ScanStatusProgress = ({ status }) => {
  const { started } = constants.scanStatuses;
  const progressWidth = 100;
  const percent = status === started ? 50 : 100;
  return (
    <Progress
      type="circle"
      percent={percent}
      width={progressWidth}
      format={(_) => <p className={styles.progressTitle}>{status}</p>}
    />
  );
};

export default ScanStatusProgress;
