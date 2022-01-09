import {
  ClockCircleFilled,
  ExclamationCircleOutlined,
  MinusCircleFilled,
  PlusCircleFilled,
  StopOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import TwoToneComponent from 'assets/TwoTone';
import React from 'react';

export const getColor = (status) => {
  switch (status) {
    case 'COVID-19 Detected': {
      return 'red';
    }
    case 'Not Detected': {
      return 'green';
    }
    case 'Inconclusive': {
      return 'orange';
    }
    case 'In Progress': {
      return 'blue';
    }
  }
};

export const getIcon = (status) => {
  switch (status) {
    case 'COVID-19 Detected': {
      return <PlusCircleFilled />;
    }
    case 'Not Detected': {
      return <MinusCircleFilled />;
    }
    case 'Inconclusive': {
      return <TwoToneComponent />;
    }
    case 'In Progress': {
      return <ClockCircleFilled />;
    }
    case 'Processing': {
      return <SyncOutlined />;
    }
    case 'Invalid': {
      return <ExclamationCircleOutlined />;
    }
    case 'Rejected': {
      return <StopOutlined />;
    }
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 'COVID-19 Detected': {
      return 'DETECTED';
    }
    case 'Rejected': {
      return (
        <Tooltip
          placement="bottom"
          title={
            <span>
              <b>REJECTED</b> - Your samples were <b>not tested</b> due to poor
              sample quality. The samples may be contaminated, empty, improperly
              collected, or have insufficient volume.
            </span>
          }
        >
          Rejected
        </Tooltip>
      );
    }
    default:
      return status.toUpperCase();
  }
};
