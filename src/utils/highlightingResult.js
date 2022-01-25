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
    default:
      return null;
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
    default:
      return null;
  }
};

const StatusText = () => {
  return (
    <span>
      <b>REJECTED</b>
      <span>- Your samples were</span>
      <b>not tested</b>
      due to poor sample quality. The samples may be contaminated, empty,
      improperly collected, or have insufficient volume.
    </span>
  );
};

export const getStatusText = (status) => {
  switch (status) {
    case 'COVID-19 Detected': {
      return 'DETECTED';
    }
    case 'Rejected': {
      return (
        <Tooltip placement="bottom" title={StatusText}>
          Rejected
        </Tooltip>
      );
    }
    default:
      return status.toUpperCase();
  }
};
