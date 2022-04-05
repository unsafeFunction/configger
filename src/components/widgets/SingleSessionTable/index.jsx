import { Button, Space, Table } from 'antd';
import moment from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { constants } from 'utils/constants';
import { rowCounter } from 'utils/tableFeatures';
import ScanStatus from './components';
import styles from './styles.module.scss';

const SingleSessionTable = ({
  session,
  scansInWork,
  handleCancelScan,
  loadScan,
}) => {
  const { completed } = constants.scanStatuses;
  const { id, isLoading } = useSelector((state) => state.scanSessions.scan);

  const columns = [
    rowCounter,
    {
      title: 'PoolName',
      dataIndex: 'scan_name',
      ellipsis: true,
    },
    {
      title: 'Pool ID',
      dataIndex: 'pool_id',
    },
    {
      title: 'Rack ID',
      dataIndex: 'rack_id',
    },
    {
      title: 'Scan time',
      dataIndex: 'scan_timestamp',
      sorter: (a, b) =>
        moment(a.scan_timestamp).valueOf() - moment(b.scan_timestamp).valueOf(),
      sortDirections: [],
      render: (value) =>
        value ? moment(value).format(constants.dateTimeFormat) : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value) => <ScanStatus status={value} />,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            disabled={isLoading || record.id === id}
            onClick={() => loadScan(record.id)}
            type="primary"
          >
            View scan
          </Button>
          {record.status === completed && (
            <Button
              disabled={isLoading}
              onClick={() => handleCancelScan(record)}
              type="primary"
            >
              Undo save
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      className="mt-4"
      loading={session?.isLoading}
      columns={columns}
      pagination={false}
      dataSource={scansInWork}
      rowClassName={(record) => record.id === id && styles.accentRow}
      scroll={{ x: 'max-content' }}
      rowKey={(record) => record.id}
    />
  );
};

SingleSessionTable.propTypes = {
  session: PropTypes.shape({}).isRequired,
  scansInWork: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleCancelScan: PropTypes.func.isRequired,
  loadScan: PropTypes.func.isRequired,
};

export default SingleSessionTable;
