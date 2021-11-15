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
  switch (status?.toLowerCase()) {
    case 'covid-19 detected':
    case 'detected':
    case 'rejected': {
      return 'red';
    }
    case 'not detected':
    case 'not_detected': {
      return 'green';
    }
    case 'inconclusive': {
      return 'orange';
    }
    case 'in progress':
    case 'in_progress': {
      return 'blue';
    }
    default:
      return 'default';
  }
};

export const getIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'covid-19 detected':
    case 'detected': {
      return <PlusCircleFilled />;
    }
    case 'not detected':
    case 'not_detected': {
      return <MinusCircleFilled />;
    }
    case 'inconclusive': {
      return <TwoToneComponent />;
    }
    case 'in progress':
    case 'in_progress': {
      return <ClockCircleFilled />;
    }
    case 'invalid': {
      return <ExclamationCircleFilled />;
    }
    case 'processing': {
      return <SyncOutlined />;
    }
    case 'rejected': {
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

export const getColorIntakeLog = (status) => {
  switch (status) {
    case 'Acceptable':
    case 'Satisfactory': {
      return 'success';
    }
    case 'Unacceptable': {
      return 'error';
    }
    case 'Unsatisfactory': {
      return 'warning';
    }
    default:
      return 'default';
  }
};
