import {
  ClockCircleFilled,
  ExclamationCircleFilled,
  MinusCircleFilled,
  PlusCircleFilled,
  QuestionCircleOutlined,
  StopOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';

export const getColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'covid-19 detected':
    case 'detected': {
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
      return <QuestionCircleOutlined />;
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
    default:
      return status.toUpperCase();
  }
};

export const getResultTooltip = (status) => {
  switch (status) {
    case 'Rejected': {
      return (
        <span>
          <b>REJECTED</b> - Your samples were <b>not tested</b> due to poor
          sample quality. The samples may be contaminated, empty, improperly
          collected, or have insufficient volume.
        </span>
      );
    }
    default:
      return null;
  }
};

export const getScanStatusText = (status) => {
  switch (status) {
    case 'STARTED': {
      return 'Editing';
    }
    case 'COMPLETED': {
      return 'Saved';
    }
    default: {
      return status;
    }
  }
};
