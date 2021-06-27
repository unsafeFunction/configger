/* eslint-disable prettier/prettier */

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
  Tag,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getColor, getIcon } from 'utils/highlightingResult';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const { Option } = Select;
const { Text } = Typography;

const PoolTable = ({ loadMore }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const pools = useSelector((state) => state.pools);
  const resutList = useSelector((state) => state.pools.resultList);

  const useFetching = () => {
    useEffect(() => {
      dispatch({ type: actions.FETCH_RESULT_LIST_REQUEST });
    }, [dispatch]);
  };

  useFetching();

  const columns = [
    {
      title: 'Results Timestamp',
      dataIndex: 'results_updated_on',
      width: 180,
      align: 'center',
      render: (value) => {
        return value || '-';
      },
    },
    {
      title: 'Run Title',
      dataIndex: 'run_title',
      align: 'center',
      render: (value) => {
        return value || '-';
      },
    },
    {
      title: 'Company',
      dataIndex: 'shortCompany',
      ellipsis: {
        showTitle: false,
      },
      align: 'center',
      sorter: {
        compare: (a, b) =>
          a.shortCompany < b.shortCompany
            ? -1
            : a.shortCompany > b.shortCompany
            ? 1
            : 0,
      },
      render: (_, record) => (
        <Popover
          content={record.company}
          trigger="hover"
          overlayClassName={styles.popover}
          placement="topLeft"
        >
          {record?.shortCompany ? record.shortCompany : '-'}
        </Popover>
      ),
    },
    {
      title: 'Pool Title',
      dataIndex: 'title',
      align: 'center',
      render: (value) => {
        return value || '-';
      },
    },
    {
      title: 'Rack ID',
      dataIndex: 'rack_id',
      align: 'center',
      render: (value) => {
        return value || '-';
      },
    },
    {
      title: 'Pool ID',
      dataIndex: 'pool_id',
      align: 'center',
      render: (value) => {
        return value || '-';
      },
    },
    {
      title: (
        <div className={styles.resultsStyle}>
          <span>Result</span>
          {/* <Tooltip
            overlayClassName={styles.hintTooltip}
            placement="bottom"
            title={
              <ul className={styles.hintList}>
                <li className={styles.hintItem}>
                  <Text className={styles.hintStatus} type="danger">
                    DETECTED -
                  </Text>
                  <span className={styles.hintDescription}>detected</span>
                </li>
                <li className={styles.hintItem}>
                  <span className={styles.hintStatus}>NOT DETECTED - </span>
                  <span className={styles.hintDescription}>detected</span>
                </li>
                <li className={styles.hintItem}>
                  <span className={styles.hintStatus}>Inconclusive - </span>
                  <span className={styles.hintDescription}>detected</span>
                </li>
                <li className={styles.hintItem}>
                  <span className={styles.hintStatus}>In progress - </span>
                  <span className={styles.hintDescription}>
                    Your samples were tested but need to be retested due to a
                    quality control.
                  </span>
                </li>
                <li className={styles.hintItem}>
                  <span className={styles.hintStatus}>Processing - </span>
                  <span className={styles.hintDescription}>
                    Your samples were received by the lab and are in queue to be
                    tested
                  </span>
                </li>
                <li className={styles.hintItem}>
                  <span className={styles.hintStatus}>Invalid - </span>
                  <span className={styles.hintDescription}>
                    Your samples obtained no result. Either the sample quality
                    was poor or there was not sufficient sample volume for
                    testing. Samples must be resubmitted. The lab has completed
                    testing on the samples.
                  </span>
                </li>
              </ul>
            }
          >
            <QuestionCircleOutlined size="small" />
          </Tooltip> */}
        </div>
      ),
      dataIndex: 'result',
      width: 195,
      sorter: {
        compare: (a, b) =>
          a.result < b.result ? -1 : a.result > b.result ? 1 : 0,
      },
      render: (_, record) =>
        user.role === 'admin' ? (
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
            style={{ width: 178 }}
            loading={record.resultIsUpdating}
            onSelect={onModalToggle(record.id, record.pool_id)}
            disabled={record.resultIsUpdating}
            bordered={false}
          >
            {resutList?.items
              ?.filter((option) => option.value !== record.result)
              .map((item) => (
                <Option key={item.key} value={item.value}>
                  <Tag color={getColor(item.value)} icon={getIcon(item.value)}>
                    {item.value === 'COVID-19 Detected'
                      ? 'DETECTED'
                      : item.value.toUpperCase()}
                  </Tag>
                </Option>
              ))}
          </Select>
        ) : (
          <Tag color={getColor(record.result)} icon={getIcon(record.result)}>
            {record.result === 'COVID-19 Detected'
              ? 'DETECTED'
              : record.result.toUpperCase()}
          </Tag>
        ),
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

  const data = pools?.items?.map?.((pool) => ({
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

  return (
    <InfiniteScroll
      next={loadMore}
      hasMore={pools.items.length < pools.total}
      loader={
        <div className={styles.spin}>
          <Spin />
        </div>
      }
      dataLength={pools.items.length}
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
  );
};

PoolTable.propTypes = {
  loadMore: PropTypes.func.isRequired,
};

export default PoolTable;
