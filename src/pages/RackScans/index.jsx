/* eslint-disable react-hooks/exhaustive-deps */
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Input,
  Menu,
  Popconfirm,
  Row,
  Table,
} from 'antd';
import classNames from 'classnames';
import TableFooter from 'components/layout/TableFooterLoader';
import ActionInitiator from 'components/widgets/ActionInitiator';
import SearchTooltip from 'components/widgets/SearchTooltip';
import debounce from 'lodash.debounce';
import moment from 'moment-timezone';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import helperActions from 'redux/helpers/actions';
import actions from 'redux/racks/actions';
import { constants } from 'utils/constants';
import labConfig from 'utils/labConfig';
import useCustomFilters from 'utils/useCustomFilters';
import styles from './styles.module.scss';

const { RangePicker } = DatePicker;

const RackScans = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const stateRef = useRef();

  const initialFiltersState = {
    search: '',
    dates: [],
  };

  const [filtersState, filtersDispatch, isEmpty] = useCustomFilters(
    initialFiltersState,
  );

  stateRef.current = filtersState.dates;

  const racks = useSelector((state) => state.racks.racks);

  const useFetching = () => {
    useEffect(() => {
      const filteringParams = {
        limit: constants.poolRacks.itemsLoadingCount,
        search: filtersState.search,
      };

      const params = filtersState.dates.length
        ? {
            scan_timestamp_after: filtersState.dates[0],
            scan_timestamp_before: filtersState.dates[1],
            ...filteringParams,
          }
        : filteringParams;

      dispatch({
        type: actions.FETCH_RACKS_REQUEST,
        payload: {
          ...params,
        },
      });
    }, [filtersState.dates]);
  };

  useFetching();

  const handleResetFilters = () => {
    return filtersDispatch({
      type: 'reset',
    });
  };

  const exportRack = useCallback(
    ({ poolId }) => {
      dispatch({
        type: helperActions.EXPORT_FILE_REQUEST,
        payload: {
          link: `/scans/rack/${poolId}/export/`,
          instanceId: poolId,
        },
      });
    },
    [dispatch],
  );

  const racksItems = racks?.items;

  const navigateToScan = (rackId) => {
    history.push({
      pathname: `/rack-scans/${rackId}/`,
    });
  };

  const handleDelete = useCallback(
    async ({ poolId }) => {
      await dispatch({
        type: actions.DELETE_RACK_BY_ID_REQUEST,
        payload: { id: poolId, fetchRacks: true },
      });
    },
    [dispatch],
  );

  const menu = (record) => (
    <Menu>
      <Menu.Item onClick={() => navigateToScan(record.id)} key="1">
        View rack
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          return exportRack({ poolId: record.id });
        }}
        key="2"
      >
        Export rack
      </Menu.Item>
      <Menu.Item key="3">
        <Popconfirm
          title="Are you sure to delete this rack?"
          okText="Yes"
          cancelText="No"
          onConfirm={() =>
            handleDelete({
              poolId: record.id,
            })
          }
        >
          Delete rack
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: `${labConfig[process.env.REACT_APP_LAB_ID].naming.rack} Name`,
      dataIndex: 'scan_name',
      render: (value) => value ?? '-',
    },
    {
      title: 'Rack ID',
      dataIndex: 'rack_id',
    },
    {
      title: 'Pools Count',
      dataIndex: 'scan_pools_count',
      width: 100,
      render: (value) => value ?? '-',
    },
    {
      title: 'Scanned on',
      dataIndex: 'scan_timestamp',
      width: 190,
      render: (value) =>
        value ? moment(value).format(constants.dateTimeFormat) : '-',
    },
    {
      title: 'Scanned by',
      dataIndex: 'scanned_by',
      render: (value) => <ActionInitiator initiator={value} />,
    },
    {
      title: 'Actions',
      fixed: 'right',
      key: 'action',
      width: 120,
      render: (_, record) => {
        return (
          <Dropdown overlay={menu(record)}>
            <Button type="primary">
              Actions
              <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const loadMore = () => {
    const filteringParams = {
      limit: constants.poolRacks.itemsLoadingCount,
      offset: racks.offset,
      search: filtersState.search,
    };

    const params = filtersState.dates.length
      ? {
          scan_timestamp_after: filtersState.dates[0],
          scan_timestamp_before: filtersState.dates[1],
          ...filteringParams,
        }
      : filteringParams;

    return dispatch({
      type: actions.FETCH_RACKS_REQUEST,
      payload: {
        ...params,
      },
    });
  };

  const sendQuery = useCallback(
    (query) => {
      const filteringParams = {
        limit: constants.poolRacks.itemsLoadingCount,
        search: query,
      };

      const params = stateRef.current.length
        ? {
            scan_timestamp_after: stateRef.current[0],
            scan_timestamp_before: stateRef.current[1],
            ...filteringParams,
          }
        : filteringParams;

      return dispatch({
        type: actions.FETCH_RACKS_REQUEST,
        payload: {
          ...params,
        },
      });
    },
    [dispatch],
  );

  const delayedQuery = useMemo(() => debounce((q) => sendQuery(q), 500), [
    sendQuery,
  ]);

  useEffect(() => {
    return () => {
      delayedQuery.cancel();
    };
  }, [delayedQuery]);

  const onChangeSearch = ({ target }) => {
    filtersDispatch({
      type: 'setValue',
      payload: {
        name: 'search',
        value: target.value,
      },
    });

    return delayedQuery(target.value);
  };

  const onDatesChange = (dates, dateStrings) => {
    return filtersDispatch({
      type: 'setValue',
      payload: {
        name: 'dates',
        value: dates ? dateStrings : [],
      },
    });
  };

  const rangePickerValue =
    filtersState.dates.length > 0
      ? [moment(filtersState.dates[0]), moment(filtersState.dates[1])]
      : [];

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>
          {`${labConfig[process.env.REACT_APP_LAB_ID].naming.rack} Scans`}
        </h4>
      </div>
      <Table
        dataSource={racksItems}
        columns={columns}
        loading={racks?.isLoading}
        align="center"
        pagination={false}
        scroll={{ x: 800 }}
        rowKey={(record) => record.id}
        title={() => (
          <Row gutter={16}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 10 }}
              md={{ span: 9, offset: 2 }}
              lg={{ span: 7, offset: 8 }}
              xl={{ span: 6, offset: 10 }}
              xxl={{ span: 7 }}
            >
              <SearchTooltip
                searchFields={[
                  'rack ID',
                  `${labConfig[process.env.REACT_APP_LAB_ID].naming.rack} name`,
                  'tube ID',
                ]}
              >
                <Input
                  size="middle"
                  prefix={<SearchOutlined />}
                  placeholder="Search..."
                  value={filtersState.search}
                  allowClear
                  onChange={onChangeSearch}
                />
              </SearchTooltip>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 10 }}
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
                value={rangePickerValue}
                onChange={onDatesChange}
                className={styles.rangePicker}
              />
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 4 }}
              md={{ span: 4 }}
              lg={{ span: 2 }}
              className={styles.resetFilters}
            >
              <Button onClick={handleResetFilters} disabled={isEmpty}>
                Reset
              </Button>
            </Col>
          </Row>
        )}
      />
      <TableFooter
        loading={racks?.isLoading}
        disabled={racksItems.length >= racks?.total}
        loadMore={loadMore}
      />
    </>
  );
};

export default RackScans;
