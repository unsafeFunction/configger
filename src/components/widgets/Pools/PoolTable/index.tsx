import { Popconfirm, Popover, Select, Switch, Table, Tag, Tooltip } from 'antd';
import TableFooter from 'components/layout/TableFooterLoader';
import { PoolType } from 'models/pool.model';
import moment from 'moment-timezone';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import modalActions from 'redux/modal/actions';
import actions from 'redux/pools/actions';
import { RootState } from 'redux/reducers';
import { constants } from 'utils/constants';
import {
  getColor,
  getIcon,
  getResultTooltip,
  getStatusText,
} from 'utils/highlighting';
import { rowCounter } from 'utils/tableFeatures';
import styles from './styles.module.scss';
import { OptionType } from './types';

type PoolTableProps = {
  loadMore: () => void;
};

const PoolTable = ({ loadMore }: PoolTableProps): JSX.Element => {
  const dispatch = useDispatch();

  const { all: pools, resultList } = useSelector<RootState, any>(
    (state) => state.pools,
  );

  const useFetching = () => {
    useEffect(() => {
      dispatch({ type: actions.FETCH_RESULT_LIST_REQUEST });
    }, []);
  };

  useFetching();

  const handlePublish = (poolId: string, checked: boolean) => {
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
    (poolUniqueId: string, poolId: string) =>
      // TODO: INCORRECT OPTION TYPE
      (_: any, option: any) => {
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
    rowCounter,
    {
      title: 'Receipt Date',
      dataIndex: 'receipt_date',
      width: 140,
      render: (value: string) =>
        value ? moment(value).format(constants.dateFormat) : '-',
    },
    {
      title: 'Company',
      dataIndex: ['company', 'name_short'],
      ellipsis: {
        showTitle: false,
      },
      render: (value: string, record: PoolType) => (
        <Popover
          content={record.company?.name}
          trigger="hover"
          overlayClassName={styles.popover}
          placement="right"
        >
          {value ?? '-'}
        </Popover>
      ),
    },
    {
      title: 'Company ID',
      dataIndex: ['company', 'company_id'],
      width: 100,
    },
    {
      title: 'Pool Title',
      dataIndex: 'title',
      render: (value: string) => {
        return value ?? '-';
      },
    },
    {
      title: 'Pool ID',
      dataIndex: 'pool_id',
      width: 100,
      render: (value: string) => {
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
      render: (value: string, record: PoolType) => (
        <Select
          value={value}
          options={resultList.items.map((item: OptionType) => {
            return {
              label: (
                <Tooltip
                  placement="bottom"
                  title={getResultTooltip(item.value)}
                >
                  <Tag color={getColor(item.value)} icon={getIcon(item.value)}>
                    {getStatusText(item.value)}
                  </Tag>
                </Tooltip>
              ),
              value: item.value,
              key: item.key,
            };
          })}
          loading={record.resultIsUpdating}
          onSelect={onModalToggle(record.id, record.pool_id)}
          disabled={record.resultIsUpdating}
          bordered={false}
          dropdownMatchSelectWidth={200}
        />
      ),
    },
    {
      title: 'Pool Size',
      dataIndex: 'pool_size',
      width: 80,
    },
    {
      title: 'Tube IDs',
      dataIndex: 'tube_ids',
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      render: (value: string[], record: PoolType) => (
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
      fixed: 'right' as 'right',
      width: 120,
      render: (_: any, record: PoolType) => (
        <Popconfirm
          title={`Sure to ${
            record.is_published ? 'unpublished' : 'published'
          }?`}
          onConfirm={() => handlePublish(record.id, !record.is_published)}
          placement="topRight"
        >
          <Switch
            checkedChildren="Published"
            unCheckedChildren="Unpublished"
            checked={record.is_published}
            loading={record.isUpdating}
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
        scroll={{ x: 1200 }}
        rowKey={(record) => record.id}
      />
      <TableFooter
        loading={pools.isLoading}
        disabled={pools.items.length >= pools.total}
        loadMore={loadMore}
      />
    </>
  );
};

export default PoolTable;
