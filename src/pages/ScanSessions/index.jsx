import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { Table, Input, Button, Tag, DatePicker, Row, Col } from 'antd';
import debounce from 'lodash.debounce';
import { SearchOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import actions from 'redux/scanSessions/actions';
import moment from 'moment-timezone';
import sortBy from 'lodash.sortby';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { RangePicker } = DatePicker;

const ScanSessions = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchName, setSearchName] = useState('');
  const [dates, setDates] = useState([]);
  const stateRef = useRef();
  stateRef.current = dates;

  const scanSessions = useSelector(state => state.scanSessions.sessions);

  const useFetching = () => {
    useEffect(() => {
      const params = dates.length
        ? {
            date_from: dates[0],
            date_to: dates[1],
            limit: constants.scanSessions.itemsLoadingCount,
            search: searchName,
          }
        : {
            limit: constants.scanSessions.itemsLoadingCount,
            search: searchName,
          };

      dispatch({
        type: actions.FETCH_SESSION_ID_REQUEST,
      });

      dispatch({
        type: actions.FETCH_SCAN_SESSIONS_REQUEST,
        payload: {
          ...params,
        },
      });
    }, [dates]);
  };

  useFetching();

  const sessionItems = scanSessions?.items?.map(session => {
    return {
      ...session,
      key: session?.id,
    };
  });

  const navigateToScan = useCallback(
    ({ sessionId, scanOrder }) => {
      history.push({
        pathname: `/scan-sessions/${sessionId}`,
        search: `?scanOrder=${scanOrder}`,
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
      render: text => {
        return (
          <Tag color="blue" className={styles.sessionStatus}>
            {text.toLowerCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Session size',
      dataIndex: 'pool_size',
      render: (_, value) => {
        return value?.scans.length || '-';
      },
    },
    {
      title: `Scanned on`,
      dataIndex: 'scanned_on',
      render: (_, value) => {
        return moment(value?.started_on_day).format('LLLL') || '-';
      },
    },
    {
      title: 'Scanned by',
      dataIndex: 'scanned_by',
      render: value => {
        return value || '-';
      },
    },
  ];

  const expandedRow = scan => {
    const columns = [
      { title: 'Pool ID', dataIndex: 'pool_id', key: 'pool_id' },
      { title: 'Rack ID', dataIndex: 'rack_id', key: 'rack_id' },
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

  const loadMore = useCallback(() => {
    const params = dates.length
      ? {
          date_from: dates[0],
          date_to: dates[1],
          limit: constants.scanSessions.itemsLoadingCount,
          offset: scanSessions.offset,
          search: searchName,
        }
      : {
          limit: constants.scanSessions.itemsLoadingCount,
          offset: scanSessions.offset,
          search: searchName,
        };
    dispatch({
      type: actions.FETCH_SCAN_SESSIONS_REQUEST,
      payload: {
        ...params,
      },
    });
  }, [dispatch, scanSessions]);

  const sendQuery = useCallback(
    query => {
      const params = stateRef.current.length
        ? {
            date_from: stateRef.current[0],
            date_to: stateRef.current[1],
            limit: constants.scanSessions.itemsLoadingCount,
            search: query,
          }
        : {
            limit: constants.scanSessions.itemsLoadingCount,
            search: query,
          };
      dispatch({
        type: actions.FETCH_SCAN_SESSIONS_REQUEST,
        payload: {
          ...params,
        },
      });
    },
    [searchName],
  );

  const delayedQuery = useCallback(
    debounce(q => sendQuery(q), 500),
    [],
  );

  const onChangeSearch = useCallback(e => {
    const { target } = e;
    setSearchName(target.value);
    delayedQuery(target.value);
  }, []);

  const onDatesChange = useCallback((dates, dateStrings) => {
    dates ? setDates(dateStrings) : setDates([]);
  }, []);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Scan Sessions</h4>
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
          pagination={{
            pageSize: sessionItems?.length,
            hideOnSinglePage: true,
          }}
          expandedRowRender={record => {
            return expandedRow(
              sortBy(record.scans, 'scan_order').map(scan => {
                return {
                  key: scan.id,
                  pool_id: scan.pool_id,
                  scan_time: moment(scan.scan_timestamp).format('LLLL'),
                  rack_id: scan.rack_id,
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
                      View scan
                    </Button>
                  ),
                };
              }),
            );
          }}
          title={() => (
            <Row gutter={16}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 9, offset: 6 }}
                lg={{ span: 7, offset: 10 }}
                xl={{ span: 6, offset: 12 }}
                xxl={{ span: 7, offset: 12 }}
              >
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search..."
                  value={searchName}
                  onChange={onChangeSearch}
                  className={classNames(styles.tableHeaderItem, styles.search)}
                />
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 9 }}
                lg={{ span: 7 }}
                xl={{ span: 6 }}
                xxl={{ span: 5 }}
              >
                <RangePicker
                  format="YYYY-MM-DD"
                  ranges={{
                    Today: [moment(), moment()],
                    'Last 7 Days': [moment().subtract(7, 'days'), moment()],
                    'This Month': [
                      moment().startOf('month'),
                      moment().endOf('month'),
                    ],
                  }}
                  onChange={onDatesChange}
                  className={classNames(
                    styles.tableHeaderItem,
                    styles.rangePicker,
                  )}
                />
              </Col>
            </Row>
          )}
        />
      </InfiniteScroll>
    </>
  );
};

export default ScanSessions;
