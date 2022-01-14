import {
  Button,
  Popconfirm,
  Popover,
  Result,
  Select,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import classNames from 'classnames';
import TableFooter from 'components/layout/TableFooterLoader';
import moment from 'moment-timezone';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { Fragment, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import modalActions from 'redux/modal/actions';
import actions from 'redux/pools/actions';
import { constants } from 'utils/constants';
import { getColor, getIcon, getStatusText } from 'utils/highlightingResult';
import styles from './styles.module.scss';

const { Option } = Select;

const PoolTableByDays = ({
  loadMore,
  selectedRowKeys,
  setSelectedRowKeys,
  gdriveEnabled,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { allByDays: pools, resultList } = useSelector((state) => state.pools);

  const useFetching = () => {
    useEffect(() => {
      dispatch({ type: actions.FETCH_RESULT_LIST_REQUEST });
    }, [dispatch]);
  };

  useFetching();

  const handlePublish = useCallback(
    (record) => {
      dispatch({
        type: actions.PUBLISH_POOL_BY_DAY_REQUEST,
        payload: {
          poolId: record.id,
          isPublished: !record.is_published,
          byDay: true,
          receiptDate: record.receipt_date,
        },
      });
    },
    [dispatch],
  );

  const resultUpdate = useCallback(
    ({ record, value }) => {
      dispatch({
        type: actions.UPDATE_POOL_RESULT_BY_DAY_REQUEST,
        payload: {
          poolId: record.id,
          result: value,
          byDay: true,
          receiptDate: record.receipt_date,
        },
      });
    },
    [dispatch],
  );

  const onModalToggle = useCallback(
    (record) => (_, option) => {
      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'COMPLIANCE_MODAL',
        modalProps: {
          title: 'Confirm action',
          cancelButtonProps: { className: styles.modalButton },
          okButtonProps: {
            className: styles.modalButton,
          },
          onOk: () => resultUpdate({ record, value: option.key }),
          bodyStyle: {
            maxHeight: '70vh',
            overflow: 'scroll',
          },
          okText: 'Update result',
          message: () =>
            `Are you sure you would like to update pool ${record.pool_id} result to ${option.value}?`,
        },
      });
    },
    [resultUpdate, dispatch],
  );

  const columns = [
    {
      title: 'Results Timestamp',
      dataIndex: 'results_updated_on',
      width: 190,
      render: (value) =>
        value ? moment(value).format(constants.dateTimeFormat) : '-',
    },
    {
      title: 'Run Title',
      dataIndex: 'run_title',
    },
    {
      title: 'Company',
      dataIndex: 'shortCompany',
      ellipsis: {
        showTitle: false,
      },
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
          {record.shortCompany}
        </Popover>
      ),
    },
    {
      title: 'Company ID',
      dataIndex: 'companyId',
      width: 100,
    },
    {
      title: 'Pool Title',
      dataIndex: 'title',
    },
    {
      title: 'Rack ID',
      dataIndex: 'rack_id',
    },
    {
      title: 'Pool ID',
      dataIndex: 'pool_id',
      width: 150,
    },
    {
      title: (
        <div className={styles.resultsStyle}>
          <span>Result</span>
        </div>
      ),
      dataIndex: 'result',
      width: 195,
      sorter: {
        compare: (a, b) =>
          a.result < b.result ? -1 : a.result > b.result ? 1 : 0,
      },
      render: (_, record) => (
        <Tooltip
          placement="bottom"
          title={
            record.result === 'Rejected' && (
              <span>
                <b>REJECTED</b> - Your samples were <b>not tested</b> due to
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
            style={{ width: 178 }}
            loading={record.resultIsUpdating}
            onSelect={onModalToggle(record)}
            disabled={record.resultIsUpdating}
            bordered={false}
          >
            {resultList.items
              ?.filter((option) => option.value !== record.result)
              .map((item) => (
                <Option key={item.key} value={item.value}>
                  <Tag color={getColor(item.value)} icon={getIcon(item.value)}>
                    {getStatusText(item.value)}
                  </Tag>
                </Option>
              ))}
          </Select>
        </Tooltip>
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
          onConfirm={() => handlePublish(record)}
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

  const onSelectChange = (selectedRowKeys) => {
    return setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  return pools?.items?.length > 0 || pools?.isLoading ? (
    <>
      {pools?.items?.map((dateItem, index) => {
        const poolDate = Object.keys(dateItem)[0];

        const data = pools?.items[index][poolDate].map((poolsItem, index) => {
          return {
            ...poolsItem,
            key: poolsItem.pool_id,
            tubes: poolsItem.tube_ids.join(', '),
            company: poolsItem.company?.name,
            shortCompany: poolsItem.company?.name_short,
            companyId: poolsItem.company?.company_id,
          };
        });

        return (
          <Fragment key={`${poolDate}-${index}`}>
            <div
              className={classNames(
                'air__utils__heading',
                styles.poolPartHeader,
              )}
            >
              <h5>{moment(poolDate).format('LL')}</h5>
            </div>

            <Table
              rowSelection={gdriveEnabled ? rowSelection : null}
              className={styles.poolsTable}
              columns={columns}
              dataSource={data}
              loading={pools.isLoading}
              pagination={false}
              scroll={{ x: 1300 }}
              bordered
            />
          </Fragment>
        );
      })}
      <TableFooter
        loading={pools.isLoading}
        disabled={pools.items.length >= pools.total}
        loadMore={loadMore}
      />
    </>
  ) : (
    <Result
      title="Pools not found!"
      extra={[
        <Button
          type="primary"
          key="console"
          onClick={() => history.push('/companies/')}
        >
          Go to Company List
        </Button>,
      ]}
    />
  );
};

PoolTableByDays.propTypes = {
  loadMore: PropTypes.func.isRequired,
};

export default PoolTableByDays;
