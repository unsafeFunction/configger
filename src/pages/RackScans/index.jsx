import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { Table, Button, Tag, DatePicker, Row, Col } from 'antd';
import helperActions from 'redux/helpers/actions';
import InfiniteScroll from 'react-infinite-scroll-component';
import actions from 'redux/racks/actions';
import moment from 'moment-timezone';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { RangePicker } = DatePicker;

const RackScans = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchName, setSearchName] = useState('');
  const [dates, setDates] = useState([]);
  const stateRef = useRef();
  stateRef.current = dates;

  const racks = useSelector((state) => state.racks.racks);

  const useFetching = () => {
    useEffect(() => {
      const filteringParams = {
        limit: constants.poolRacks.itemsLoadingCount,
        search: searchName,
      };

      const params = dates.length
        ? {
            scan_timestamp_after: dates[0],
            scan_timestamp_before: dates[1],
            ...filteringParams,
          }
        : filteringParams;

      dispatch({
        type: actions.FETCH_RACKS_REQUEST,
        payload: {
          ...params,
        },
      });
    }, [dates]);
  };

  const exportRack = useCallback(
    ({ name, poolId }) => {
      dispatch({
        type: helperActions.EXPORT_FILE_REQUEST,
        payload: {
          link: `/scans/rack/${poolId}/export`,
          instanceId: poolId,
          name,
          contentType: 'text/csv',
        },
      });
    },
    [dispatch],
  );

  useFetching();

  const racksItems = racks?.items;

  const navigateToScan = useCallback(
    (rackId) => {
      history.push({
        pathname: `/rack-scans/${rackId}`,
      });
    },
    [history],
  );

  const columns = [
    {
      title: 'PoolRack Name',
      dataIndex: 'rack_name',
    },
    {
      title: 'Rack ID',
      dataIndex: 'rack_id',
    },
    {
      title: 'Pools Count',
      dataIndex: 'scan_pools_count',
      render: (value) => {
        return value ?? '-';
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 90,
      render: (text) => {
        return (
          <Tag color="blue" className={styles.sessionStatus}>
            {text.toLowerCase()}
          </Tag>
        );
      },
    },
    {
      title: `Scan Timestamp`,
      dataIndex: 'scan_timestamp',
      render: (_, value) => {
        return moment(value?.scan_timestamp).format('llll') ?? '-';
      },
    },
    {
      title: 'Logged By',
      dataIndex: 'scanned_by',
      render: (value) => {
        return value ?? '-';
      },
    },
    {
      title: 'Actions',
      fixed: 'right',
      key: 'action',
      width: 150,
      render: (_, record) => {
        return (
          <div className={styles.actions}>
            <Button
              className="mr-3"
              onClick={() => navigateToScan(record.id)}
              type="primary"
            >
              View rack
            </Button>
            <Button
              onClick={() => {
                return exportRack({
                  poolId: record.id,
                  name: record.pool_name,
                });
              }}
              type="primary"
            >
              Export rack
            </Button>
          </div>
        );
      },
    },
  ];

  const loadMore = useCallback(() => {
    const filteringParams = {
      limit: constants.poolRacks.itemsLoadingCount,
      offset: racks.offset,
      search: searchName,
    };

    const params = dates.length
      ? {
          scan_timestamp_after: dates[0],
          scan_timestamp_before: dates[1],
          ...filteringParams,
        }
      : filteringParams;

    return dispatch({
      type: actions.FETCH_RACKS_REQUEST,
      payload: {
        ...params,
      },
    });
  }, [dispatch, racks, searchName, dates]);

  const onDatesChange = useCallback((dates, dateStrings) => {
    return dates ? setDates(dateStrings) : setDates([]);
  }, []);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>PoolRack Scans</h4>
      </div>
      <InfiniteScroll
        next={loadMore}
        hasMore={racksItems.length < racks?.total}
        dataLength={racksItems?.length}
      >
        <Table
          dataSource={racksItems}
          columns={columns}
          bordered
          loading={racks?.isLoading}
          align="center"
          pagination={false}
          rowKey={(record) => record.id}
          title={() => (
            <Row gutter={16}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 9, offset: 6 }}
                lg={{ span: 7, offset: 10 }}
                xl={{ span: 6, offset: 12 }}
                xxl={{ span: 7, offset: 12 }}
              />
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

export default RackScans;
