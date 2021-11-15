import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Menu,
  Popconfirm,
  Row,
  Table,
  Tag,
} from 'antd';
import classNames from 'classnames';
import moment from 'moment-timezone';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import helperActions from 'redux/helpers/actions';
import actions from 'redux/racks/actions';
import { constants } from 'utils/constants';
import { DownOutlined } from '@ant-design/icons';
import TableFooter from 'components/layout/TableFooterLoader';
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

  useFetching();

  const racksItems = racks?.items;

  const navigateToScan = useCallback(
    (rackId) => {
      history.push({
        pathname: `/rack-scans/${rackId}/`,
      });
    },
    [history],
  );

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
      title: 'PoolRack Name',
      dataIndex: 'scan_name',
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
        return moment(value?.scan_timestamp).format('lll') ?? '-';
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
      <Table
        dataSource={racksItems}
        columns={columns}
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
      <TableFooter
        loading={racks?.isLoading}
        disabled={racksItems.length >= racks?.total}
        loadMore={loadMore}
      />
    </>
  );
};

export default RackScans;
