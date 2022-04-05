import { Progress } from 'antd';
import React from 'react';
import { constants } from 'utils/constants';
import { getScanStatusText } from 'utils/highlighting';
import styles from './styles.module.scss';

type StatusProps = {
  status: string;
};

const ScanStatusProgress = ({ status }: StatusProps): JSX.Element => {
  const { started, completed, error } = constants.scanStatuses;
  const progressWidth = 100;

  const getProps = () => {
    switch (status) {
      case started: {
        return {
          percent: 50,
          // strokeColor: '#0679a6',
        };
      }
      case completed: {
        return {
          percent: 100,
          // strokeColor: '#46be8a',
        };
      }
      case error: {
        return {
          percent: 25,
          strokeColor: '#fb434a',
        };
      }
      default: {
        return { percent: 0 };
      }
    }
  };

  return (
    <Progress
      type="circle"
      width={progressWidth}
      strokeColor={{
        '0%': '#0679a6',
        '50%': '#46be8a',
        '100%': '#46be8a',
      }}
      {...getProps()}
      format={() => (
        <p className={styles.progressTitle}>
          {getScanStatusText(status)?.toUpperCase()}
        </p>
      )}
    />
  );
};

export default ScanStatusProgress;
