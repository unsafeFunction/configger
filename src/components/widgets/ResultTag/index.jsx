import { Tag } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import { getColor, getColorRun, getIcon } from 'utils/highlighting';

export const getStatus = (status) => {
  switch (status) {
    case 'QPCR': {
      return 'qPCR';
    }
    default:
      return status;
  }
};

const ResultTag = ({ color = '', icon = null, status, type }) => {
  switch (type) {
    case 'run': {
      const formattedColor = color || getColorRun(status);
      return (
        <Tag color={formattedColor} icon={icon}>
          {getStatus(status)}
        </Tag>
      );
    }
    case 'sample': {
      return (
        <Tag color={color || getColor(status)} icon={getIcon(status)}>
          {status?.replaceAll('_', ' ')?.toUpperCase()}
        </Tag>
      );
    }
    default: {
      return <Tag>{status.toUpperCase()}</Tag>;
    }
  }
};

ResultTag.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.node,
  status: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default ResultTag;
