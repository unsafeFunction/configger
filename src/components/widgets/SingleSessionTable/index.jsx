import { Button, Table } from 'antd';
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
      dataIndex: 'scan_time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value) => <ScanStatus status={value} />,
    },
    {
      title: 'Actions',
      dataIndex: 'action',
    },
  ];

  const dataForTable = scansInWork.map((scan) => {
    return {
      key: scan.id,
      scan_name: scan.scan_name,
      pool_id: scan.pool_id,
      status: scan.status,
      scan_time: moment(scan.scan_timestamp).format(constants.dateTimeFormat),
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
              Undo save
            </Button>
          )}
        </div>
      ),
    };
  });

  return (
    <Table
      className="mt-4"
      loading={session?.isLoading}
      columns={columns}
      pagination={false}
      dataSource={dataForTable}
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
