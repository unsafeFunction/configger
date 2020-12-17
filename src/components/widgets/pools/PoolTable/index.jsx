import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/pools/actions';
import modalActions from 'redux/modal/actions';
import {
  Table,
  Spin,
  Switch,
  Popconfirm,
  Popover,
  Select,
  Typography,
} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './styles.module.scss';

const { Option } = Select;
const { Text } = Typography;

const PoolTable = ({ loadMore }) => {
  const dispatch = useDispatch();

  const user = useSelector(state => state.user);
  const pools = useSelector(state => state.pools);
  const resutList = useSelector(state => state.pools.resultList);

  const useFetching = () => {
    useEffect(() => {
      dispatch({ type: actions.FETCH_RESULT_LIST_REQUEST });
    }, [dispatch]);
  };

  useFetching();

  const columns = [
    {
      title: 'Pool ID',
      dataIndex: 'pool_id',
    },
    {
      title: 'Pool Title',
      dataIndex: 'title',
    },
    {
      title: 'Pool Size',
      dataIndex: 'pool_size',
    },
    {
      title: 'Tube IDs',
      dataIndex: 'tubes',
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => (
        <Popover
          content={record.tubes}
          title={`${record.pool_id} tubes`}
          trigger="hover"
          overlayClassName={styles.popover}
          placement="topLeft"
        >
          {record.tubes}
        </Popover>
      ),
    },
    {
      title: 'Result',
      dataIndex: 'result',
      width: 182,
      render: (_, record) => (
        <Select
          value={
            <Text type={record.result === 'COVID-19 Detected' && 'danger'}>
              {record.result}
            </Text>
          }
          style={{ width: 165 }}
          loading={record.resultIsUpdating}
          onSelect={onModalToggle(record.unique_id, record.pool_id)}
          disabled={user.role === 'staff' || record.resultIsUpdating}
        >
          {resutList?.items
            ?.filter(option => option.value !== record.result)
            .map(item => (
              <Option key={item.key} value={item.value}>
                <Text type={item.value === 'COVID-19 Detected' && 'danger'}>
                  {item.value}
                </Text>
              </Option>
            ))}
        </Select>
      ),
    },
    {
      title: 'Results Timestamp',
      dataIndex: 'results_updated_on',
      width: 180,
    },
    {
      title: 'Company',
      dataIndex: 'shortCompany',
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => (
        <Popover
          content={record.company}
          trigger="hover"
          overlayClassName={styles.popover}
          placement="topLeft"
        >
          {record.shortCompany}
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
          onConfirm={() =>
            handlePublish(record.unique_id, !record.is_published)
          }
          placement="topRight"
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

  const data = pools?.items?.map?.(pool => ({
    ...pool,
    key: pool.unique_id,
    tubes: pool.tube_ids.join(', '),
    company: pool.company.name,
    shortCompany: pool.company.name_short,
  }));

  const handlePublish = useCallback(
    (poolId, checked) => {
      dispatch({
        type: actions.PUBLISH_POOL_REQUEST,
        payload: {
          poolId,
          isPublished: checked,
        },
      });
    },
    [dispatch],
  );

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
          onOk: () => resultUpdate({ poolUniqueId, value: option.key }),
          bodyStyle: {
            maxHeight: '70vh',
            overflow: 'scroll',
          },
          okText: 'Update result',
          message: () => `Sure to updated ${poolId} ${option.value}?`,
          width: '40%',
        },
      });
    },
    [resultUpdate, dispatch],
  );

  return (
    <>
      <InfiniteScroll
        next={loadMore}
        hasMore={pools?.items?.length < pools.total}
        loader={
          <div className={styles.spin}>
            <Spin />
          </div>
        }
        dataLength={pools?.items?.length}
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={pools.isLoading}
          pagination={false}
          scroll={{ x: 1000 }}
          bordered
        />
      </InfiniteScroll>
    </>
  );
};

export default PoolTable;
