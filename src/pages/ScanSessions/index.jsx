import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Input, Row, Table, Tag } from 'antd';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import moment from 'moment-timezone';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import helperActions from 'redux/helpers/actions';
import actions from 'redux/scanSessions/actions';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { RangePicker } = DatePicker;

const ScanSessions = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [openedRow, setOpenedRow] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [dates, setDates] = useState([]);
  const stateRef = useRef();
  stateRef.current = dates;

  const { items: sessionItems, isLoading, total, offset } = useSelector(
    (state) => state.scanSessions.sessions,
  );

  const { scans, isLoading: scansIsLoading } = useSelector(
    (state) => state.scanSessions.singleSession,
  );

  const useFetching = () => {
    useEffect(() => {
      const filteringParams = {
        limit: constants.scanSessions.itemsLoadingCount,
        search: searchName,
      };

      const params = dates.length
        ? {
            completed_timestamp_after: dates[0],
            completed_timestamp_before: dates[1],
            ...filteringParams,
          }
        : filteringParams;

      dispatch({
        type: actions.FETCH_SCAN_SESSIONS_REQUEST,
        payload: {
          ...params,
        },
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dates]);
  };

  useFetching();

  const navigateToScan = useCallback(
    ({ sessionId, scanId }) => {
      history.push({ pathname: `/pool-scans/${sessionId}/${scanId}` });
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
      dataIndex: 'completed_timestamp',
      render: (_, value) => {
        return value?.completed_timestamp
          ? moment(value.completed_timestamp).format('llll')
          : '-';
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
      { title: 'Pool Name', dataIndex: 'scan_name', key: 'scan_name' },
      {
        title: 'Scan time',
        dataIndex: 'scan_time',
        key: 'scan_time',
        width: 300,
      },
      { title: 'Scanner', dataIndex: 'scanner', key: 'scanner' },
      { title: 'Action', dataIndex: 'action', key: 'action' },
    ];

    return (
      <Table
        columns={columns}
        dataSource={scan}
        pagination={false}
        loading={scansIsLoading}
      />
    );
  };

  const loadMore = useCallback(() => {
    const filteringParams = {
      limit: constants.scanSessions.itemsLoadingCount,
      offset,
      search: searchName,
    };

    const params = dates.length
      ? {
          completed_timestamp_after: dates[0],
          completed_timestamp_before: dates[1],
          ...filteringParams,
        }
      : filteringParams;

    return dispatch({
      type: actions.FETCH_SCAN_SESSIONS_REQUEST,
      payload: {
        ...params,
      },
    });
  }, [dispatch, searchName, dates, offset]);

  const sendQuery = useCallback(
    (query) => {
      const filteringParams = {
        limit: constants.scanSessions.itemsLoadingCount,
        search: query,
      };

      const params = stateRef.current.length
        ? {
            completed_timestamp_after: stateRef.current[0],
            completed_timestamp_before: stateRef.current[1],
            ...filteringParams,
          }
        : filteringParams;

      return dispatch({
        type: actions.FETCH_SCAN_SESSIONS_REQUEST,
        payload: {
          ...params,
        },
      });
    },
    [dispatch],
  );

  const delayedQuery = debounce((q) => sendQuery(q), 500);

  const onChangeSearch = useCallback(
    (e) => {
      const { target } = e;

      setSearchName(target.value);

      return delayedQuery(target.value);
    },
    [delayedQuery],
  );

  const onDatesChange = useCallback((dates, dateStrings) => {
    return dates ? setDates(dateStrings) : setDates([]);
  }, []);

  const handleExpand = useCallback(
    (expanded, record) => {
      if (expanded) {
        setOpenedRow([record.id]);
        dispatch({
          type: actions.FETCH_SCAN_SESSION_BY_ID_REQUEST,
          payload: { sessionId: record.id },
        });
      } else {
        setOpenedRow([]);
      }
    },
    [dispatch],
  );

  const exportPool = useCallback(
    ({ poolId }) => {
      dispatch({
        type: helperActions.EXPORT_FILE_REQUEST,
        payload: {
          link: `/scans/pool/${poolId}/export/`,
          instanceId: poolId,
        },
      });
    },
    [dispatch],
  );

  const getPoolName = useCallback((scan) => {
    if (scan?.isLoading) {
      return '-';
    }
    if (scan?.scan_name) {
      return scan.scan_name;
    }
    if (!scan?.scan_name) {
      return scan?.ordinal_name;
    }
    return '-';
  }, []);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Pool Scans</h4>
      </div>

      <InfiniteScroll
        next={loadMore}
        hasMore={sessionItems.length < total}
        dataLength={sessionItems?.length}
      >
        <Table
          dataSource={sessionItems}
          columns={columns}
          scroll={{ x: 1000 }}
          bordered
          loading={!isLoading}
          align="center"
          pagination={false}
          rowKey={(record) => record.id}
          expandRowByClick
          expandedRowKeys={openedRow}
          onExpand={handleExpand}
          expandedRowRender={(record) => {
            return expandedRow(
              scans.map((scan) => {
                const poolName = getPoolName(scan);

                return {
                  key: scan.id,
                  pool_id: scan.pool_id,
                  scan_time: scan.scan_timestamp
                    ? moment(scan.scan_timestamp).format('LLLL')
                    : '-',
                  scan_name: poolName,
                  scanner: scan.scanner ?? '-',
                  action: (
                    <>
                      <Button
                        onClick={() =>
                          navigateToScan({
                            sessionId: record.id,
                            scanId: scan.id,
                          })
                        }
                        className="mr-3"
                        type="primary"
                      >
                        View pool
                      </Button>
                      <Button
                        onClick={() => {
                          return exportPool({ poolId: scan.id });
                        }}
                        type="primary"
                      >
                        Export pool
                      </Button>
                    </>
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
