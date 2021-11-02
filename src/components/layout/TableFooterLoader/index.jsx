import React from 'react';
import { Button, Tooltip } from 'antd';
import { DownCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import styles from './style.module.scss';

const TableFooter = ({ loading, loadMore, disabled }) => {
  return (
    <div className={styles.tableFooter}>
      <Tooltip title={disabled ? 'No more data' : 'Load more data'}>
        <Button
          loading={loading}
          type="primary"
          onClick={loadMore}
          disabled={disabled}
          icon={<DownCircleOutlined />}
        >
          Load more
        </Button>
      </Tooltip>
    </div>
  );
};

TableFooter.propTypes = {
  loading: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default TableFooter;
