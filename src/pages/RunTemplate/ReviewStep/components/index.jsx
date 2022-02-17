import { Table } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import { rowCounter } from 'utils/tableFeatures';
import styles from './styles.module.scss';

const ReviewTable = ({ data }) => {
  const columns = [
    rowCounter,
    {
      title: 'Method',
      dataIndex: 'method',
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'Start column',
      dataIndex: 'start_column',
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'Run type',
      dataIndex: 'run_type',
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'Layout type',
      dataIndex: 'layout_type',
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'Run number',
      dataIndex: 'run_number',
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'QS Machine',
      dataIndex: 'qs_machine',
      ellipsis: true,
      align: 'center',
    },
  ];

  return (
    <>
      <Table
        className="mb-4"
        columns={columns}
        rowClassName={styles.row}
        dataSource={data}
        pagination={false}
        scroll={{ x: 'max-content' }}
        rowKey={(record) => record.id}
      />
    </>
  );
};

ReviewTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default ReviewTable;
