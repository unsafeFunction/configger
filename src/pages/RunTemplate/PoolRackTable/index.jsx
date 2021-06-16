import { DatePicker, Spin, Table, Typography } from 'antd';
import differenceBy from 'lodash.differenceby';
import moment from 'moment-timezone';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import poolRackActions from 'redux/racks/actions';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { RangePicker } = DatePicker;

const PoolRackTable = ({ setSelectedRows, runState, limit }) => {
  const dispatch = useDispatch();

  const [dates, setDates] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([
    ...runState.poolRacks.map((item) => item.id),
  ]);

  const poolRacks = useSelector((state) => state.racks.racks);

  const dateParams = {
    scan_timestamp_after: dates[0],
    scan_timestamp_before: dates[1],
  };

  const useFetching = () => {
    useEffect(() => {
      const filteringParams = {
        limit: constants.poolRacks.itemsLoadingCount,
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

  useEffect(() => {
    setSelectedRows(runState.poolRacks);
  }, [runState.poolRacks, setSelectedRows]);

  const loadMore = useCallback(() => {
    const filteringParams = {
      limit: constants.poolRacks.itemsLoadingCount,
      offset: poolRacks.offset,
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
  }, [dispatch, poolRacks, dates, dateParams]);

  const onDatesChange = useCallback(
    (dates, dateStrings) => {
      return setDates(dates ? dateStrings : []);
    },
    [setDates],
  );

  const columns = [
    {
      title: 'PoolRack Name',
      dataIndex: 'scan_name',
      ellipsis: true,
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
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled:
        selectedRowKeys.length >= limit.max
          ? selectedRowKeys.every((item) => {
              return record.id !== item;
            })
          : false,
    }),
  };

  const data = [
    ...runState.poolRacks,
    ...differenceBy(poolRacks.items, runState.poolRacks, 'id'),
  ];

  return (
    <>
      <InfiniteScroll
        next={loadMore}
        hasMore={poolRacks.items.length < poolRacks.total}
        loader={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <div className={styles.spin}>
            <Spin />
          </div>
        }
        dataLength={poolRacks.items.length}
        height="70vh"
      >
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          loading={poolRacks.isLoading}
          pagination={false}
          scroll={{ x: 'max-content' }}
          bordered
          rowKey={(record) => record.id}
          title={() => (
            <div className={styles.tableHeader}>
              <Typography.Text strong>
                {selectedRowKeys.length
                  ? `Selected ${selectedRowKeys.length} items`
                  : ''}
              </Typography.Text>

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
                className={styles.rangePicker}
              />
            </div>
          )}
        />
      </InfiniteScroll>
    </>
  );
};

PoolRackTable.propTypes = {
  setSelectedRows: PropTypes.func.isRequired,
  runState: PropTypes.shape({}).isRequired,
  limit: PropTypes.shape({}).isRequired,
};

export default PoolRackTable;
