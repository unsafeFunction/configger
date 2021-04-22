import { Button, Table, Tag } from 'antd';
import moment from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

const SingleSessionTable = ({
  session,
  handleNavigateToScan,
  handleCancelScan,
}) => {
  const { started, invalid, completed } = constants.scanStatuses;

  const columns = [
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

  const scanInWork = session?.scans?.find(
    (s) => s.status === (started || invalid),
  );

  const scanInWorkArr = scanInWork ? [scanInWork] : [];

  const dataForTable = [
    ...scanInWorkArr,
    ...session?.scans?.filter((scan) => scan.status === completed),
  ].map((scan) => {
    return {
      key: scan.id,
      pool_id: scan.pool_id,
      status: scan.status,
      scan_time: moment(scan.scan_timestamp).format('llll'),
      rack_id: scan.rack_id,
      scanner: scan.scanner ?? '-',
      action: (
        <div className={styles.actions}>
          <Button
            onClick={() =>
              handleNavigateToScan({
                scanOrder: scan.scan_order,
              })
            }
            type="primary"
          >
            View scan
          </Button>
          {scan.status === 'COMPLETED' && (
            <Button onClick={() => handleCancelScan(scan)} type="primary">
              Cancel
            </Button>
          )}
        </div>
      ),
    };
  });

  return (
    <Table
      loading={
        session?.isLoading && (session?.scans?.length === 0 || !session.scans)
      }
      columns={columns}
      pagination={false}
      dataSource={dataForTable}
      scroll={{ y: 200, x: 600 }}
    />
  );
};

SingleSessionTable.propTypes = {
  session: PropTypes.shape({}).isRequired,
  handleNavigateToScan: PropTypes.func.isRequired,
  handleCancelScan: PropTypes.func.isRequired,
};

export default SingleSessionTable;
