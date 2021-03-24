import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import poolRackActions from 'redux/racks/actions';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Row, Col, Table, Spin, Tag, Button, Input, DatePicker } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment-timezone';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { RangePicker } = DatePicker;

const PoolRackTable = ({ setPoolRack, runState }) => {
  const dispatch = useDispatch();

  const [searchName, setSearchName] = useState('');
  const [dates, setDates] = useState([]);

  const poolRacks = useSelector((state) => state.racks.racks);

  const dateParams = {
    scan_timestamp_after: dates[0],
    scan_timestamp_before: dates[1],
  };

  const useFetching = () => {
    useEffect(() => {
      const filteringParams = {
        limit: constants.poolRacks.itemsLoadingCount,
        search: searchName,
      };

      const params = dates.length
        ? {
            ...dateParams,
            ...filteringParams,
          }
        : filteringParams;

      dispatch({
        type: poolRackActions.FETCH_RACKS_REQUEST,
        payload: {
          ...params,
        },
      });
    }, [dates]);
  };

  useFetching();

  const loadMore = useCallback(() => {
    const filteringParams = {
      limit: constants.poolRacks.itemsLoadingCount,
      offset: poolRacks.offset,
      search: searchName,
    };

    const params = dates.length
      ? {
          ...dateParams,
          ...filteringParams,
        }
      : filteringParams;

    return dispatch({
      type: poolRackActions.FETCH_RACKS_REQUEST,
      payload: {
        ...params,
      },
    });
  }, [dispatch, poolRacks, searchName, dates]);

  // TODO: leave here
  // const sendQuery = useCallback(
  //   (query) => {
  //     const filteringParams = {
  //       limit: constants.poolRacks.itemsLoadingCount,
  //       search: query,
  //     };

  //     const params = stateRef.current.length
  //       ? {
  //           scan_timestamp_after: stateRef.current[0],
  //           scan_timestamp_before: stateRef.current[1],
  //           ...filteringParams,
  //         }
  //       : filteringParams;

  //     return dispatch({
  //       type: actions.FETCH_RACKS_REQUEST,
  //       payload: {
  //         ...params,
  //       },
  //     });
  //   },
  //   [dispatch],
  // );

  // const delayedQuery = useCallback(
  //   debounce((q) => sendQuery(q), 500),
  //   [],
  // );

  // const onChangeSearch = useCallback(
  //   (e) => {
  //     const { target } = e;

  //     setSearchName(target.value);

  //     return delayedQuery(target.value);
  //   },
  //   [delayedQuery],
  // );

  const onDatesChange = useCallback(
    (dates, dateStrings) => {
      return setDates(dates ? dateStrings : []);
    },
    [setDates],
  );

  const columns = [
    {
      title: 'PoolRack Name',
      dataIndex: '',
    },
    {
      title: 'PoolRack RackID',
      dataIndex: 'rack_id',
    },
    {
      title: 'Pool Count',
      dataIndex: 'scan_pools_count',
    },
    {
      title: `Scan Timestamp`,
      dataIndex: 'scan_timestamp',
      render: (_, value) => {
        return moment(value?.scan_timestamp).format('llll') ?? '-';
      },
    },
    {
      title: 'Scanned By',
      dataIndex: '',
    },
    {
      title: 'Actions',
      // TODO: leave here
      // render: (_, record) => <Button type="link">View plate</Button>,
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setPoolRack(selectedRows[0]);
    },
    getCheckboxProps: (record) => ({
      // TODO: rewrite
      disabled:
        record.id === runState.poolRacks?.[0]?.id ||
        record.id === runState.poolRacks?.[1]?.id ||
        record.id === runState.poolRacks?.[2]?.id ||
        record.id === runState.poolRacks?.[3]?.id,
    }),
  };

  return (
    <>
      <InfiniteScroll
        next={loadMore}
        hasMore={poolRacks.items.length < poolRacks.total}
        loader={
          <div className={styles.spin}>
            <Spin />
          </div>
        }
        dataLength={poolRacks.items.length}
        height="70vh"
      >
        <Table
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          columns={columns}
          dataSource={poolRacks.items}
          loading={poolRacks.isLoading}
          pagination={false}
          scroll={{ x: 'max-content' }}
          bordered
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
              >
                {/* TODO: leave here */}
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search..."
                  // value={searchName}
                  // onChange={onChangeSearch}
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

PoolRackTable.propTypes = {
  setPoolRack: PropTypes.func.isRequired,
  runState: PropTypes.shape({}).isRequired,
};

export default PoolRackTable;
