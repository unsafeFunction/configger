import { Button, Table, Tag } from 'antd';
import moment from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.module.scss';

const SingleSessionTable = ({
  scansInWork,
  isLoading,
  handleNavigateToScan,
  handleCancelScan,
  loadScan,
}) => {
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

  const dataForTable = scansInWork.map((scan) => {
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
            // onClick={() =>
            //   handleNavigateToScan({
            //     scanOrder: scan.scan_order,
            //   })
            // }
            onClick={() => loadScan(scan.id)}
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
        // TODO: зачем второе сравнение? третье всегда - false (scansInWork = [])
        isLoading && (scansInWork.length === 0 || !scansInWork)
      }
      columns={columns}
      pagination={false}
      dataSource={dataForTable}
      scroll={{ y: 200, x: 600 }}
    />
  );
};

SingleSessionTable.propTypes = {
  scansInWork: PropTypes.shape([]).isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleNavigateToScan: PropTypes.func.isRequired,
  handleCancelScan: PropTypes.func.isRequired,
  loadScan: PropTypes.func.isRequired,
};

export default SingleSessionTable;
