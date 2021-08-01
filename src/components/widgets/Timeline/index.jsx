/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { Timeline } from 'antd';
import useTimelineStatus from './hooks';

const RunTimeline = ({ timeline = [] }) => {
  return (
    <Timeline mode="alternate">
      {timeline.map?.((timelineItem) => {
        return (
          <Timeline.Item key={timelineItem.id} color="green">
            {useTimelineStatus(timelineItem)}
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
};

export default RunTimeline;
