import { Popover } from 'antd';
import useWindowSize from 'hooks/useWindowSize';
import React from 'react';

type InitiatorProps = {
  initiator: string;
};

const ActionInitiator = ({ initiator }: InitiatorProps) => {
  const { isMobile } = useWindowSize();

  const regexp = /(.*)\s\[(.+)\]/;
  const formattedInitiator: string[] | null = initiator.match(regexp);

  if (formattedInitiator?.[1] && formattedInitiator?.[2]) {
    return (
      <Popover
        content={formattedInitiator[2]}
        trigger="hover"
        placement={isMobile ? 'top' : 'right'}
      >
        {formattedInitiator[1]}
      </Popover>
    );
  }
  return initiator;
};

export default ActionInitiator;
