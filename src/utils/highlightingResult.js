import {
  ClockCircleFilled,
  ExclamationCircleFilled,
  MinusCircleFilled,
  PlusCircleFilled,
} from '@ant-design/icons';
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
