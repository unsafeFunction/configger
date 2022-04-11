import {
  DatePicker,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tooltip,
  Typography,
  Row,
  Col,
  Input,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import TableFooter from 'components/layout/TableFooterLoader';
import moment from 'moment-timezone';
import qs from 'qs';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import actions from 'redux/runs/actions';
import { constants } from 'utils/constants';
import { rowCounter } from 'utils/tableFeatures';
import styles from './styles.module.scss';

const Runs = () => {
  const { RangePicker } = DatePicker;
  const { Text } = Typography;

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [dates, setDates] = useState([]);
  const [searchName, setSearchName] = useState('');

  const runs = useSelector((state) => state.runs);

  const { from, to } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const useFetching = () => {
    useEffect(() => {
      const params =
        from && to
          ? { from, to, limit: constants.runs.itemsLoadingCount }
          : { limit: constants.runs.itemsLoadingCount };
      dispatch({
        type: actions.FETCH_RUNS_REQUEST,
        payload: {
          ...params,
        },
      });
    }, [dispatch, dates, history]);
  };

  useFetching();

  const onPublishChange = useCallback(
    (runId, checked) => {
      dispatch({
        type: actions.PUBLISH_RUN_REQUEST,
        payload: {
          runId,
          isPublished: checked,
        },
      });
    },
    [dispatch],
  );

  const sendQuery = useCallback(
    (query) => {
      dispatch({
        type: actions.FETCH_RUNS_REQUEST,
        payload: {
          search: query,
        },
      });
    },
    [dispatch],
  );

  const columns = [
    rowCounter,
    {
      title: 'Companies',
      dataIndex: 'companies',
      render: (companies, record) =>
        companies.map((company) => (
          <div key={company.company_id} className={styles.company}>
            <Space size="middle">
              <Link to={`/runs/${record.id}`}>
                <Text className="text-blue">{company.name}</Text>
              </Link>
              <Text>{company.name_short}</Text>
              <Text>{company.company_id}</Text>
            </Space>
          </div>
        )),
    },
    {
      title: 'Run Title',
      dataIndex: 'run_title',
      ellipsis: {
        showTitle: false,
      },
      width: 250,
      render: (_, record) => (
        <Tooltip title={record.run_title} placement="topLeft">
          {record.run_title}
        </Tooltip>
      ),
    },
    {
      title: 'Pools Published',
      dataIndex: 'pools_published',
      width: 100,
    },
    {
      title: 'Pools Unpublished',
      dataIndex: 'pools_unpublished',
      width: 100,
    },
    {
      title: 'Results Timestamp',
      dataIndex: 'results_timestamp',
      width: 190,
      render: (value) =>
        value ? moment(value).format(constants.dateTimeFormat) : '-',
    },
    {
      title: 'Action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title={`Sure to ${
            record.pools_unpublished === 0 ? 'unpublished' : 'published'
          }?`}
          onConfirm={() =>
            onPublishChange(record.id, !(record.pools_unpublished === 0))
          }
          placement="topRight"
        >
          <Switch
            checkedChildren="Published"
            unCheckedChildren="Unpublished"
            checked={record.pools_unpublished === 0}
            loading={record.isUpdating}
          />
        </Popconfirm>
      ),
    },
  ];

  const onDatesChange = useCallback((dates, dateStrings) => {
    if (dates) {
      history.push({ search: `?from=${dateStrings[0]}&to=${dateStrings[1]}` });
      setDates(dateStrings);
    } else {
      history.push({ search: '' });
      setDates([]);
    }
  }, []);

  const loadMore = useCallback(() => {
    const params =
      from && to
        ? {
            from,
            to,
            limit: constants.runs.itemsLoadingCount,
            offset: runs.offset,
          }
        : { limit: constants.runs.itemsLoadingCount, offset: runs.offset };
    dispatch({
      type: actions.FETCH_RUNS_REQUEST,
      payload: {
        ...params,
      },
    });
  }, [dispatch, from, to, runs]);

  const delayedQuery = useMemo(() => debounce((q) => sendQuery(q), 500), [
    sendQuery,
  ]);

  useEffect(() => {
    return () => {
      delayedQuery.cancel();
    };
  }, [delayedQuery]);

  const onChangeSearch = useCallback((event) => {
    setSearchName(event.target.value);
    delayedQuery(event.target.value);
  }, []);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Runs</h4>
        <Row>
          <Col className="mr-3">
            <Input
              size="middle"
              onChange={onChangeSearch}
              value={searchName}
              prefix={<SearchOutlined />}
              className={styles.search}
              placeholder="Search by barcode..."
            />
          </Col>
          <Col>
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
                'This Month': [
                  moment().startOf('month'),
                  moment().endOf('month'),
                ],
              }}
              onChange={onDatesChange}
              className={styles.rangePicker}
            />
          </Col>
        </Row>
      </div>
      <Table
        columns={columns}
        dataSource={runs.items}
        loading={runs.isLoading}
        pagination={false}
        scroll={{ x: 1200 }}
        rowKey={(record) => record.id}
      />
      <TableFooter
        loading={runs.isLoading}
        disabled={runs.items.length >= runs.total}
        loadMore={loadMore}
      />
    </>
  );
};

export default Runs;
