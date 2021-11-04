import {
  Popconfirm,
  Popover,
  Select,
  Spin,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import moment from 'moment-timezone';
// eslint-disable-next-line import/no-extraneous-dependencies
/* eslint-disable react/jsx-wrap-multilines */
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import modalActions from 'redux/modal/actions';
import actions from 'redux/pools/actions';
import { getColor, getIcon, getStatusText } from 'utils/highlighting';
import styles from './styles.module.scss';
import TableFooter from '../../../layout/TableFooterLoader';

moment.tz.setDefault('America/New_York');

const { Option } = Select;

const PoolTable = ({ loadMore, searchInput }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const pools = useSelector((state) => state.pools);
  const resutList = useSelector((state) => state.pools.resultList);

  const useFetching = () => {
    useEffect(() => {
      dispatch({ type: actions.FETCH_RESULT_LIST_REQUEST });
    }, []);
  };

  useFetching();

  const handlePublish = (poolId, checked) => {
    dispatch({
      type: actions.PUBLISH_POOL_REQUEST,
      payload: {
        poolId,
        isPublished: checked,
      },
    });
  };

  const resultUpdate = useCallback(
    ({ poolUniqueId, value }) => {
      dispatch({
        type: actions.UPDATE_POOL_RESULT_REQUEST,
        payload: {
          poolId: poolUniqueId,
          result: value,
        },
      });
    },
    [dispatch],
  );

  const onModalToggle = useCallback(
    (poolUniqueId, poolId) => (_, option) => {
      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'COMPLIANCE_MODAL',
        modalProps: {
          title: 'Confirm action',
          cancelButtonProps: { className: styles.modalButton },
          okButtonProps: {
            className: styles.modalButton,
          },
          onOk: () => resultUpdate({ poolUniqueId, value: option.key }),
          bodyStyle: {
            maxHeight: '70vh',
            overflow: 'scroll',
          },
          okText: 'Update result',
          message: () =>
            `Are you sure you would like to update pool ${poolId} result to ${option.value}?`,
        },
      });
    },
    [resultUpdate, dispatch],
  );

  const columns = [
    {
      title: 'Receipt Timestamp',
      dataIndex: 'test_receipt_timestamp',
      width: 180,
      render: (value) => (value ? moment(value).format('lll') : '–'),
    },
    {
      title: 'Run Title',
      dataIndex: 'run_title',
      render: (value) => {
        return value ?? '-';
      },
    },
    {
      title: 'Company',
      dataIndex: ['company', 'name_short'],
      ellipsis: {
        showTitle: false,
      },
      render: (value, record) => (
        <Popover
          content={record.company?.name}
          trigger="hover"
          overlayClassName={styles.popover}
          placement="topLeft"
        >
          {value ?? '–'}
        </Popover>
      ),
    },
    {
      title: 'Pool Title',
      dataIndex: 'title',
      render: (value) => {
        return value ?? '-';
      },
    },
    {
      title: 'Rack ID',
      dataIndex: 'rack_id',
      render: (value) => {
        return value ?? '-';
      },
    },
    {
      title: 'Pool ID',
      dataIndex: 'pool_id',
      width: 100,
      render: (value) => {
        return value ?? '-';
      },
    },
    {
      title: (
        <div className={styles.resultsStyle}>
          <span>Result</span>
        </div>
      ),
      dataIndex: 'result',
      width: 195,
      render: (_, record) =>
        user.role === 'admin' ? (
          <Tooltip
            placement="bottom"
            title={
              record.result === 'Rejected' && (
                <span>
                  <b>REJECTED</b> - Your samples were<b>not tested</b> due to
                  poor sample quality. The samples may be contaminated, empty,
                  improperly collected, or have insufficient volume.
                </span>
              )
            }
          >
            <Select
              value={
                <Tag
                  color={getColor(record.result)}
                  icon={getIcon(record.result)}
                >
                  {record.result === 'COVID-19 Detected'
                    ? 'DETECTED'
                    : record.result.toUpperCase()}
                </Tag>
              }
              // style={{ width: 178 }}
              loading={record.resultIsUpdating}
              onSelect={onModalToggle(record.id, record.pool_id)}
              disabled={record.resultIsUpdating}
            >
              {resutList?.items
                ?.filter((option) => option.value !== record.result)
                .map((item) => (
                  <Option key={item.key} value={item.value}>
                    <Tag
                      color={getColor(item.value)}
                      icon={getIcon(item.value)}
                    >
                      {getStatusText(item.value)}
                    </Tag>
                  </Option>
                ))}
            </Select>
          </Tooltip>
        ) : (
          <Tag color={getColor(record.result)} icon={getIcon(record.result)}>
            {getStatusText(record.result)}
          </Tag>
        ),
    },
    {
      title: 'Pool Size',
      dataIndex: 'pool_size',
    },
    {
      title: 'Tube IDs',
      dataIndex: 'tube_ids',
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      render: (value, record) => (
        <Popover
          content={value.join(', ')}
          title={`${record.pool_id} tubes`}
          trigger="hover"
          overlayClassName={styles.popover}
          placement="topLeft"
        >
          {value.join(', ')}
        </Popover>
      ),
    },
    {
      title: 'Action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title={`Sure to ${
            record.is_published ? 'unpublished' : 'published'
          }?`}
          onConfirm={() => handlePublish(record.id, !record.is_published)}
          placement="topRight"
          disabled={user.role === 'staff'}
        >
          <Switch
            checkedChildren="Published"
            unCheckedChildren="Unpublished"
            checked={record.is_published}
            loading={record.isUpdating}
            disabled={user.role === 'staff'}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={pools.items}
        loading={pools.isLoading}
        pagination={false}
        scroll={{ x: 1400 }}
        rowKey={(record) => record.id}
        title={() => <div className="d-flex">{searchInput}</div>}
      />
      <TableFooter
        loading={pools.isLoading}
        disabled={pools.items.length >= pools.total}
        loadMore={loadMore}
      />
    </>
  );
};

PoolTable.propTypes = {
  loadMore: PropTypes.func.isRequired,
};

export default PoolTable;
