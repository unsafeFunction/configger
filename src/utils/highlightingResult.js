import {
  ClockCircleFilled,
  ExclamationCircleFilled,
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
    case 'COVID-19 Detected':
    case 'DETECTED': {
      return 'red';
    }
    case 'Not Detected':
    case 'NOT_DETECTED': {
      return 'green';
    }
    case 'Inconclusive':
    case 'INCONCLUSIVE': {
      return 'orange';
    }
    case 'In Progress':
    case 'IN_PROGRESS': {
      return 'blue';
    }
    case 'Invalid':
    case 'INVALID': {
      return 'default';
    }
    default:
      return 'Unknown';
  }
};

export const getIcon = (status) => {
  switch (status) {
    case 'COVID-19 Detected':
    case 'DETECTED': {
      return <PlusCircleFilled />;
    }
    case 'Not Detected':
    case 'NOT_DETECTED': {
      return <MinusCircleFilled />;
    }
    case 'Inconclusive':
    case 'INCONCLUSIVE': {
      return <TwoToneComponent />;
    }
    case 'In Progress':
    case 'IN_PROGRESS': {
      return <ClockCircleFilled />;
    }
    case 'Invalid':
    case 'INVALID': {
      return <ExclamationCircleFilled />;
    }
    case 'Processing': {
      return <SyncOutlined />;
    }
    case 'Rejected': {
      return <StopOutlined />;
    }
    default:
      return '';
  }
};

export const getColorRun = (status) => {
  switch (status) {
    case 'QPCR': {
      return 'blue';
    }
    case 'ANALYSIS': {
      return 'orange';
    }
    case 'REVIEW': {
      return 'red';
    }
    case 'PUBLISHED': {
      return 'green';
    }
    default:
      return 'Unknown';
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
