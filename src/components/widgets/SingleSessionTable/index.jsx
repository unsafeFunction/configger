import React, { useCallback } from 'react';
import { Table, Button } from 'antd';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

const SingleSessionTable = ({ session, handleNavigateToScan }) => {
  const columns = [
    { title: 'Pool ID', dataIndex: 'pool_id', key: 'pool_id' },
    { title: 'Rack ID', dataIndex: 'rack_id', key: 'rack_id' },
    {
      title: 'Scan time',
      dataIndex: 'scan_time',
      key: 'scan_time',
      width: 250,
    },
    { title: 'Scanner', dataIndex: 'scanner', key: 'scanner' },
    { title: 'Action', dataIndex: 'action', key: 'action' },
  ];

  const history = useHistory();

  // const navigateToScan = useCallback(
  //   ({ sessionId, scanOrder }) => {
  //     history.push({
  //       pathname: `/scan-sessions/${sessionId}`,
  //       search: `?scanOrder=${scanOrder}`,
  //     });
  //   },
  //   [history],
  // );

  const dataForTable = session?.scans?.map(scan => {
    return {
      key: scan.id,
      pool_id: scan.pool_id,
      scan_time: moment(scan.scan_timestamp).format('LLLL'),
      rack_id: scan.rack_id,
      scanner: scan.scanner ?? '-',
      action: (
        <Button
          // onClick={() =>
          //   navigateToScan({
          //     sessionId: session.id,
          //     scanOrder: scan.scan_order,
          //   })
          // }
          onClick={() =>
            handleNavigateToScan({
              scanOrder: scan.scan_order,
            })
          }
          type="primary"
        >
          View scan
        </Button>
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
      scroll={{ y: 'calc(30vh - 4em)' }}
    />
  );
};

SingleSessionTable.propTypes = {
  session: PropTypes.shape({}).isRequired,
  handleNavigateToScan: PropTypes.func.isRequired,
};

export default SingleSessionTable;
