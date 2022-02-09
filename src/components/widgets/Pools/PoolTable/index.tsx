import { Popconfirm, Popover, Select, Switch, Table, Tag, Tooltip } from 'antd';
import TableFooter from 'components/layout/TableFooterLoader';
import moment from 'moment-timezone';
/* eslint-disable react/jsx-wrap-multilines */
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import modalActions from 'redux/modal/actions';
import actions from 'redux/pools/actions';
import { constants } from 'utils/constants';
import { getColor, getIcon } from 'utils/highlighting';
import { RootState } from 'redux/reducers';
import styles from './styles.module.scss';
import { PoolType } from 'models/pool.model';

type PoolTableProps = {
  loadMore: () => void;
};

const PoolTable = ({ loadMore }: PoolTableProps): JSX.Element => {
  const dispatch = useDispatch();

  const { all: pools } = useSelector<RootState, any>((state) => state.pools);

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
      (_: undefined, option: any) => {
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
      title: 'Receipt Date',
      dataIndex: 'receipt_date',
      width: 140,
      render: (value: string) =>
        value ? moment(value).format(constants.dateFormat) : '-',
    },
    {
      title: 'Run Title',
      dataIndex: 'run_title',
      render: (value: string) => {
        return value ?? '-';
      },
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
          placement="topLeft"
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
      title: 'Rack ID',
      dataIndex: 'rack_id',
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
      render: (_: null, record: PoolType) => (
        <Tooltip
          placement="bottom"
          title={
            record.result === 'Rejected' && (
              <span>
                <b>REJECTED</b> - Your samples were<b>not tested</b> due to poor
                sample quality. The samples may be contaminated, empty,
                improperly collected, or have insufficient volume.
              </span>
            )
          }
        >
          <Select
            value={
              ((
                <Tag
                  color={getColor(record.result)}
                  icon={getIcon(record.result)}
                >
                  {record.result === 'COVID-19 Detected'
                    ? 'DETECTED'
                    : record.result.toUpperCase()}
                </Tag>
              ) as unknown) as undefined
            }
            loading={record.resultIsUpdating}
            onSelect={onModalToggle(record.id, record.pool_id)}
            disabled={record.resultIsUpdating}
            bordered={false}
            dropdownMatchSelectWidth={200}
          />
        </Tooltip>
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
        scroll={{ x: 1400 }}
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

PoolTable.propTypes = {
  loadMore: PropTypes.func.isRequired,
};

export default PoolTable;
