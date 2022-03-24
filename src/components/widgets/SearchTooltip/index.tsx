import { Popover } from 'antd';
import useWindowSize from 'hooks/useWindowSize';
import React from 'react';
import styles from './styles.module.scss';

type TooltipProps = {
  searchFields: string[];
  children: JSX.Element;
};

const SearchTooltip = ({
  searchFields,
  children,
}: TooltipProps): JSX.Element => {
  const { isMobile } = useWindowSize();

  const popoverContent = (
    <div className={styles.popoverWrapper}>
      <p>You can search information using the following fields:</p>
      <p>
        <b>{searchFields.join(', ')}</b>
      </p>
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      title="Search fields"
      trigger="hover"
      placement={isMobile ? 'bottom' : 'left'}
    >
      {children}
    </Popover>
  );
};

export default SearchTooltip;
