/* eslint-disable indent */
import { DeleteOutlined } from '@ant-design/icons';
import { Button, DatePicker, Empty, Popconfirm, Table } from 'antd';
import classNames from 'classnames';
import TableFooter from 'components/layout/TableFooterLoader';
import ActionInitiator from 'components/widgets/ActionInitiator';
import ResultTag from 'components/widgets/ResultTag';
import moment from 'moment-timezone';
import qs from 'qs';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import actions from 'redux/reflex/actions';
import { constants } from 'utils/constants';
import labConfig from 'utils/labConfig';
import { rowCounter } from 'utils/tableFeatures';
import ReflexStatus from './components';
import styles from './styles.module.scss';

const ReflexList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const reflexList = useSelector((state) => state.reflex.all);

  const { date } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_REFLEX_LIST_REQUEST,
        payload: {
          date,
          limit: constants?.reflexList?.itemsLoadingCount,
        },
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, date, history]);
  };

  useFetching();

  const onDateChange = useCallback(
    (date, dateString) => {
      history.push({
        search: date ? `?date=${dateString}` : '',
      });
    },
    [history],
  );

  const loadMore = useCallback(() => {
    dispatch({
      type: actions.FETCH_REFLEX_LIST_REQUEST,
      payload: {
        date,
        limit: constants?.reflexList?.itemsLoadingCount,
        offset: reflexList.offset,
      },
    });
  }, [dispatch, date, reflexList]);

  const handleReflexItemDelete = (id) => {
    dispatch({
      type: actions.DELETE_REFLEX_ITEM_REQUEST,
      payload: { id },
    });
  };

  const columns = [
    rowCounter,
    {
      title: 'Company Short',
      dataIndex: 'name_short',
    },
    {
      title: 'Pool Name',
      dataIndex: 'pool_name',
    },
    {
      title: 'PoolScan Rack ID',
      dataIndex: 'poolrack_id',
    },
    {
      title: 'Tube Type',
      dataIndex: 'tube_type',
    },
    {
      title: 'Sample ID',
      dataIndex: 'sample_id',
      render: (value, record) => (
        <Link to={`/reflex-list/${record.id}`} className="table-link">
          {value}
        </Link>
      ),
    },
    {
      title: 'Result',
      dataIndex: 'analysis_result',
      render: (value) => {
        return <ResultTag status={value} type="sample" />;
      },
    },
    {
      title: 'Pool Run',
      dataIndex: 'pool_run_title',
    },
    {
      title: 'Action',
      dataIndex: 'action',
    },
    {
      title: `${labConfig[process.env.REACT_APP_LAB_ID].naming.rack} Position`,
      dataIndex: 'rack_position',
    },
    {
      title: 'Rack ID',
      dataIndex: 'rack_id',
    },
    {
      title: 'Completed',
      dataIndex: 'completed',
      align: 'center',
      render: (value, record) => <ReflexStatus value={value} record={record} />,
    },
    {
      title: 'Completed By',
      dataIndex: 'completed_by',
      render: (value) => <ActionInitiator initiator={value} />,
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Popconfirm
          title={`Are you sure you want to remove the ${record.sample_id} sample from Rexlex List?`}
          onConfirm={() => handleReflexItemDelete(record.id)}
          placement="topRight"
        >
          <Button
            icon={<DeleteOutlined />}
            type="link"
            loading={record.isUpdating}
          >
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Reflex List</h4>
      </div>

      <Table
        className="mb-5"
        pagination={false}
        columns={columns}
        dataSource={reflexList.items}
        scroll={{ x: 'max-content' }}
        rowKey={(record) => record.id}
        title={() => {
          return (
            <div className="d-flex">
              <h5>{moment(date).format('LL')}</h5>
              <DatePicker
                className="ml-auto"
                defaultValue={date ? moment(date) : null}
                format="YYYY-MM-DD"
                onChange={onDateChange}
              />
            </div>
          );
        }}
        locale={{
          emptyText: () => (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 80,
              }}
              description={<span>No samples to reflex for this date</span>}
              className="mt-2 mb-2"
            />
          ),
        }}
      />
      <TableFooter
        loading={reflexList?.isLoading}
        disabled={reflexList.items.length >= reflexList.total}
        loadMore={loadMore}
      />
    </div>
  );
};

export default ReflexList;
