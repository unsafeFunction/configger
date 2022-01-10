import {
  DatePicker,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import classNames from 'classnames';
import TableFooter from 'components/layout/TableFooterLoader';
import moment from 'moment-timezone';
import qs from 'qs';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import actions from 'redux/runs/actions';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

const Runs = () => {
  const { RangePicker } = DatePicker;
  const { Text } = Typography;

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [dates, setDates] = useState([]);

  const user = useSelector((state) => state.user);
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

  const columns = [
    {
      title: 'Companies',
      dataIndex: 'companies',
      render: (companies, record) =>
        companies.map((company) => (
          <div key={company.id} className={styles.company}>
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
      dataIndex: 'import_filename',
      ellipsis: {
        showTitle: false,
      },
      width: 250,
      render: (_, record) => (
        <Tooltip title={record.import_filename} placement="topLeft">
          {record.import_filename}
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
      width: 150,
      render: (value) => {
        return value ? moment(value).format(constants.dateTimeFormat) : '-';
      },
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
          disabled={user.role === 'staff'}
        >
          <Switch
            checkedChildren="Published"
            unCheckedChildren="Unpublished"
            checked={record.pools_unpublished === 0}
            loading={record.isUpdating}
            disabled={user.role === 'staff'}
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
          className={styles.rangePicker}
        />
      </div>
      <Table
        columns={columns}
        dataSource={runs.items}
        loading={runs.isLoading}
        pagination={false}
        scroll={{ x: 'max-content' }}
        bordered
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
