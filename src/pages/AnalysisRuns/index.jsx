import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { Table, Button, Tag, DatePicker } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import actions from 'redux/runs/actions';
import moment from 'moment-timezone';
import sortBy from 'lodash.sortby';
import { constants } from 'utils/constants';
import qs from 'qs';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { RangePicker } = DatePicker;

const ScanSessions = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [dates, setDates] = useState([]);
  const location = useLocation();
  const stateRef = useRef();
  stateRef.current = dates;

  const scanSessions = useSelector((state) => state.scanSessions.sessions);
  const runs = useSelector((state) => state.runs);

  const { from, to } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const useFetching = () => {
    useEffect(() => {
      const params =
        from && to
          ? { from, to, limit: constants?.runs?.itemsLoadingCount }
          : { limit: constants?.runs?.itemsLoadingCount };
      dispatch({
        type: actions.FETCH_RUNS_REQUEST,
        payload: {
          ...params,
        },
      });
    }, [dispatch, dates, history]);
  };

  useFetching();

  const sessionItems = scanSessions?.items;

  const navigateToScan = useCallback(
    ({ sessionId }) => {
      history.push({
        pathname: `/pool-scans/${sessionId}`,
      });
    },
    [history],
  );

  const columns = [
    {
      title: 'Session name',
      dataIndex: 'scan_session_title',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text) => {
        return (
          <Tag color="blue" className={styles.sessionStatus}>
            {text.toLowerCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Pools Count',
      dataIndex: 'pool_size',
      render: (_, value) => {
        return value?.scans.length || '-';
      },
    },
    {
      title: `Scanned on`,
      dataIndex: 'started_on_day',
      render: (_, value) => {
        return moment(value?.started_on_day).format('llll') || '-';
      },
    },
    {
      title: 'Scanned by',
      dataIndex: 'scanned_by',
      render: (value) => {
        return value || '-';
      },
    },
  ];

  const expandedRow = (scan) => {
    const columns = [
      { title: 'Pool ID', dataIndex: 'pool_id', key: 'pool_id' },
      { title: 'Pool Name', dataIndex: 'pool_name', key: 'pool_name' },
      {
        title: 'Scan time',
        dataIndex: 'scan_time',
        key: 'scan_time',
        width: 300,
      },
      { title: 'Scanner', dataIndex: 'scanner', key: 'scanner' },
      { title: 'Action', dataIndex: 'action', key: 'action' },
    ];

    return <Table columns={columns} dataSource={scan} pagination={false} />;
  };

  const onDatesChange = useCallback((dates, dateStrings) => {
    return dates ? setDates(dateStrings) : setDates([]);
  }, []);

  const loadMore = useCallback(() => {
    const params =
      from && to
        ? {
            from,
            to,
            limit: constants?.runs?.itemsLoadingCount,
            offset: runs.offset,
          }
        : { limit: constants?.runs?.itemsLoadingCount, offset: runs.offset };
    dispatch({
      type: actions.FETCH_RUNS_REQUEST,
      payload: {
        ...params,
      },
    });
  }, [dispatch, from, to, runs]);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Runs</h4>
        <RangePicker
          defaultValue={
            from && to
              ? [moment(from), moment(to)]
              : [moment().subtract(7, 'days'), moment()]
          }
          format="YYYY-MM-DD"
          ranges={{
            Today: [moment(), moment()],
            'Last 7 Days': [moment().subtract(7, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
          }}
          onChange={onDatesChange}
        />
      </div>

      <InfiniteScroll
        next={loadMore}
        hasMore={sessionItems.length < scanSessions?.total}
        dataLength={sessionItems?.length}
      >
        <Table
          dataSource={sessionItems}
          columns={columns}
          scroll={{ x: 1000 }}
          bordered
          loading={!scanSessions?.isLoading}
          align="center"
          pagination={false}
          rowKey={(record) => record.id}
          expandedRowRender={(record) => {
            return expandedRow(
              sortBy(record.scans, 'scan_order').map((scan) => {
                return {
                  key: scan.id,
                  pool_id: scan.pool_id,
                  scan_time: moment(scan.scan_timestamp).format('LLLL'),
                  pool_name:
                    scan?.scan_order >= 0
                      ? `${
                          moment(scan?.scan_timestamp)?.format('dddd')?.[0]
                        }${scan?.scan_order + 1}`
                      : '-',
                  scanner: scan.scanner ?? '-',
                  action: (
                    <Button
                      onClick={() =>
                        navigateToScan({
                          sessionId: record.id,
                          scanOrder: scan.scan_order,
                        })
                      }
                      type="primary"
                    >
                      View pool
                    </Button>
                  ),
                };
              }),
            );
          }}
        />
      </InfiniteScroll>
    </>
  );
};

export default ScanSessions;
