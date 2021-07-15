import {
  ClockCircleFilled,
  ExclamationCircleOutlined,
  MinusCircleFilled,
  PlusCircleFilled,
  SyncOutlined,
} from '@ant-design/icons';
import TwoToneComponent from 'assets/TwoTone';
import React from 'react';

export const getColor = (status) => {
  switch (status) {
    case 'COVID-19 Detected':
    case 'Detected': {
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
    // case 'Processing': {
    //   return (
    //
    //   )
    // }
    // case 'Invalid': {
    //   return (
    //
    //   )
    // }
    default:
      return 'Unknown';
  }
};

export const getIcon = (status) => {
  switch (status) {
    case 'COVID-19 Detected':
    case 'Detected': {
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
    default:
      return 'Unknown';
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
