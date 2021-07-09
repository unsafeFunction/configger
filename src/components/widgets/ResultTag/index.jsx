import { Tag } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import { getColor, getColorRun, getIcon } from 'utils/highlightingResult';

const ResultTag = ({ color = '', icon = null, status, type }) => {
  switch (type) {
    case 'run': {
      const formattedColor = color ?? getColorRun(status);
      return (
        <Tag color={formattedColor} icon={icon}>
          {status}
        </Tag>
      );
    }
    case 'pool': {
      return (
        <Tag color={getColor(status)} icon={getIcon(status)}>
          {status.toUpperCase()}
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
