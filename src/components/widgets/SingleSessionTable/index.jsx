import { Button, Table, Tag } from 'antd';
import moment from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import styles from './styles.module.scss';

const SingleSessionTable = ({
  session,
  scansInWork,
  handleCancelScan,
  loadScan,
}) => {
  const { id, isLoading } = useSelector((state) => state.scanSessions.scan);

  const columns = [
    {
      title: 'PoolName',
      dataIndex: 'scan_name',
      key: 'scan_name',
      width: 100,
      ellipsis: true,
    },
    { title: 'Pool ID', dataIndex: 'pool_id', key: 'pool_id', width: 100 },
    { title: 'Rack ID', dataIndex: 'rack_id', key: 'rack_id', width: 100 },
    {
      title: 'Scan time',
      dataIndex: 'scan_time',
      key: 'scan_time',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => {
        return (
          <Tag color="blue" className={styles.sessionStatus}>
            {text.toLowerCase()}
          </Tag>
        );
      },
    },
    { title: 'Actions', dataIndex: 'action', key: 'action', width: 200 },
  ];

  const dataForTable = scansInWork.map((scan) => {
    return {
      key: scan.id,
      scan_name: scan.scan_name,
      pool_id: scan.pool_id,
      status: scan.status,
      // TODO: fix format
      scan_time: moment(scan.scan_timestamp).format('lll'),
      rack_id: scan.rack_id,
      scanner: scan.scanner ?? '-',
      action: (
        <div className={styles.actions}>
          <Button
            disabled={isLoading}
            onClick={() => loadScan(scan.id)}
            type="primary"
          >
            View scan
          </Button>
          {scan.status === 'COMPLETED' && (
            <Button
              disabled={isLoading}
              onClick={() => handleCancelScan(scan)}
              type="primary"
            >
              Cancel
            </Button>
          )}
        </div>
      ),
    };
  });

  return (
    <Table
      loading={session?.isLoading}
      columns={columns}
      pagination={false}
      dataSource={dataForTable}
      scroll={{ y: 200, x: 600 }}
      rowClassName={(record) => record.key === id && styles.highlightedRow}
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
