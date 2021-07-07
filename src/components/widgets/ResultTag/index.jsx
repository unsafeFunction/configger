import { Tag } from 'antd';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { getColorRun } from 'utils/highlightingResult';

const ResultTag = ({ color = '', icon = null, status }) => {
  const formattedColor = color || getColorRun(status);
  return (
    <Tag color={formattedColor} icon={icon}>
      {status}
    </Tag>
  );
};

ResultTag.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.node,
  status: PropTypes.string,
};

export default ResultTag;
