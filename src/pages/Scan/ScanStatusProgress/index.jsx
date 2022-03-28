import { Progress } from 'antd';
import React from 'react';
import { constants } from 'utils/constants';
import { getScanStatusText } from 'utils/highlighting';
import styles from './styles.module.scss';

const ScanStatusProgress = ({ status }) => {
  const { started, completed } = constants.scanStatuses;
  const progressWidth = 100;

  const getPercent = () => {
    switch (status) {
      case started: {
        return 50;
      }
      case completed: {
        return 100;
      }
      default: {
        return 0;
      }
    }
  };

  return (
    <Progress
      type="circle"
      percent={getPercent()}
      width={progressWidth}
      strokeColor="#0679a6"
      format={() => (
        <p className={styles.progressTitle}>
          {getScanStatusText(status)?.toUpperCase()}
        </p>
      )}
    />
  );
};

export default ScanStatusProgress;
