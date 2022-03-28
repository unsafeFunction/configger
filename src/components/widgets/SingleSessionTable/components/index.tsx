/* eslint-disable import/prefer-default-export */
import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { getScanStatusText } from 'utils/highlighting';
import styles from './styles.module.scss';

type StatusProps = {
  status: string;
};

const ScanStatus = ({ status }: StatusProps): JSX.Element => {
  switch (status) {
    case 'STARTED': {
      return (
        <Typography.Text className={classNames(styles.status, styles.progress)}>
          <EditOutlined />
          {getScanStatusText(status)}
        </Typography.Text>
      );
    }
    case 'COMPLETED': {
      return (
        <Typography.Text className={classNames(styles.status, styles.success)}>
          <CheckOutlined />
          {getScanStatusText(status)}
        </Typography.Text>
      );
    }
    default: {
      return <Typography.Text>{status}</Typography.Text>;
    }
  }
};

export default ScanStatus;
