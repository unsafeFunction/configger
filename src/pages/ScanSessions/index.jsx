/* eslint-disable indent */
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Input,
  Menu,
  Row,
  Table,
} from 'antd';
import classNames from 'classnames';
import TableFooter from 'components/layout/TableFooterLoader';
import SearchTooltip from 'components/widgets/SearchTooltip';
import debounce from 'lodash.debounce';
import moment from 'moment-timezone';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import helperActions from 'redux/helpers/actions';
import actions from 'redux/scanSessions/actions';
import { constants } from 'utils/constants';
import useCustomFilters from 'utils/useCustomFilters';
import styles from './styles.module.scss';

const { RangePicker } = DatePicker;

const ScanSessions = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [openedRows, setOpenedRows] = useState([]);
  const [loadingRowId, setLoadingRow] = useState(null);
  const [allScans, setAllScans] = useState([]);
  const stateRef = useRef();

  const initialFiltersState = {
    search: '',
    dates: [],
  };

  const [filtersState, filtersDispatch, isEmpty] = useCustomFilters(
    initialFiltersState,
  );

  stateRef.current = filtersState.dates;

  const { items: sessionItems, isLoading, total, offset } = useSelector(
    (state) => state.scanSessions.sessions,
  );

  const { scans, isLoading: scansIsLoading, id: sessionId } = useSelector(
    (state) => state.scanSessions.singleSession,
  );

  const useFetching = () => {
    useEffect(() => {
      const filteringParams = {
        limit: constants.scanSessions.itemsLoadingCount,
        search: filtersState.search,
      };

      const params = filtersState.dates.length
        ? {
            completed_timestamp_after: filtersState.dates[0],
            completed_timestamp_before: filtersState.dates[1],
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
    }, [filtersState.dates]);
  };

  useFetching();

  const handleResetFilters = () => {
    return filtersDispatch({
      type: 'reset',
    });
  };

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
      title: 'Total Pools Count',
      dataIndex: 'pool_size',
      width: 100,
      render: (_, record) => {
        return record?.scans.length ?? '-';
      },
    },
    {
      title: 'Total Samples Count',
      dataIndex: 'samples_count',
      width: 110,
      render: (value) => value ?? '-',
    },
    {
      title: `Scanned on`,
      dataIndex: 'completed_timestamp',
      width: 190,
      render: (value) =>
        value ? moment(value).format(constants.dateTimeFormat) : '-',
    },
    {
      title: 'Scanned by',
      dataIndex: 'scanned_by',
      render: (value) => value ?? '-',
    },
  ];

  const loadMore = () => {
    const filteringParams = {
      limit: constants.scanSessions.itemsLoadingCount,
      offset,
      search: filtersState.search,
    };

    const params = filtersState.dates.length
      ? {
          completed_timestamp_after: filtersState.dates[0],
          completed_timestamp_before: filtersState.dates[1],
          ...filteringParams,
        }
      : filteringParams;

    return dispatch({
      type: actions.FETCH_SCAN_SESSIONS_REQUEST,
      payload: {
        ...params,
      },
    });
  };

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

  const handleExpand = useCallback(
    (expanded, record) => {
      if (expanded) {
        setOpenedRows([...openedRows, record.id]);
        setLoadingRow(record.id);
        dispatch({
          type: actions.FETCH_SCAN_SESSION_BY_ID_REQUEST,
          payload: { sessionId: record.id },
        });
      } else {
        setOpenedRows(openedRows.filter((id) => id !== record.id));
      }
    },
    [dispatch, openedRows],
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

  const handleDelete = useCallback(
    async ({ poolId, sessionId }) => {
      await dispatch({
        type: actions.DELETE_SCAN_BY_ID_REQUEST,
        payload: { id: poolId, sessionId },
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

  const menu = (sessionId, scan) => (
    <Menu>
      <Menu.Item
        onClick={() =>
          navigateToScan({
            sessionId,
            scanId: scan.id,
          })
        }
        key="1"
      >
        View pool
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          return exportPool({ poolId: scan.id });
        }}
        key="2"
      >
        Export pool
      </Menu.Item>
      {/* <Menu.Item key="3">
        <Popconfirm
      // TODO: if required uncomment
          title="Are you sure to delete this pool?"
          okText="Yes"
          cancelText="No"
          onConfirm={() =>
            handleDelete({
              poolId: scan.id,
              sessionId,
            })
          }
        >
          Delete pool
        </Popconfirm>
      </Menu.Item> */}
    </Menu>
  );

  useEffect(() => {
    const formattedScans = scans.map((scan) => {
      const poolName = getPoolName(scan);

      return {
        key: scan.id,
        pool_id: (
          <Link
            className="table-link"
            to={`/pool-scans/${sessionId}/${scan.id}`}
          >
            {scan.pool_id}
          </Link>
        ),
        scan_time: scan.scan_timestamp
          ? moment(scan.scan_timestamp).format(constants.dateTimeFormat)
          : '-',
        scan_name: poolName,
        pool_size: scan.tubes_count,
        rack_id: scan.rack_id,
        scanner: scan.scanner ?? '-',
        actions: (
          <>
            <Dropdown overlay={menu(sessionId, scan)}>
              <Button type="primary">
                Actions
                <DownOutlined />
              </Button>
            </Dropdown>
          </>
        ),
      };
    });

    setAllScans([
      ...allScans,
      {
        id: sessionId,
        data: formattedScans,
      },
    ]);
  }, [scans]);

  const expandedRow = (record) => {
    const columns = [
      {
        title: 'Pool ID',
        dataIndex: 'pool_id',
        key: 'pool_id',
      },
      {
        title: 'Pool Name',
        dataIndex: 'scan_name',
        key: 'scan_name',
      },
      {
        title: 'Pool Size',
        dataIndex: 'pool_size',
        key: 'pool_size',
      },
      { title: 'Rack ID', dataIndex: 'rack_id', key: 'rack_id', width: 100 },
      {
        title: 'Scan time',
        dataIndex: 'scan_time',
        key: 'scan_time',
        width: 190,
        defaultSortOrder: 'ascend',
        sorter: (a, b) =>
          moment(a.scan_time).valueOf() - moment(b.scan_time).valueOf(),
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      { title: 'Scanner', dataIndex: 'scanner', key: 'scanner' },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        width: 100,
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={
          allScans?.find((recordScans) => recordScans?.id === record.id)?.data
        }
        pagination={false}
        loading={record.id === loadingRowId ? scansIsLoading : false}
      />
    );
  };

  const rangePickerValue =
    filtersState.dates.length > 0
      ? [moment(filtersState.dates[0]), moment(filtersState.dates[1])]
      : [];

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Pool Scans</h4>
      </div>

      <Table
        dataSource={sessionItems}
        columns={columns}
        scroll={{ x: 1000 }}
        loading={!isLoading}
        pagination={false}
        rowKey={(record) => record.id}
        expandRowByClick
        expandedRowKeys={openedRows}
        onExpand={handleExpand}
        expandedRowRender={(record) => {
          return expandedRow(record);
        }}
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
                  'session name',
                  'company ID',
                  'company name',
                  'company name short',
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
        loading={!isLoading}
        disabled={sessionItems.length >= total}
        loadMore={loadMore}
      />
    </>
  );
};

export default ScanSessions;
