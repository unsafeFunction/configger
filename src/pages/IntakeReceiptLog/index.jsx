import { DownOutlined, CommentOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, Menu, Space, Popover, Table,Tag } from 'antd';
import classNames from 'classnames';
import IntakeReceiptLogModal from 'components/widgets/IntakeLog/IntakeReceiptLogModal';
import omit from 'lodash.omit';
import moment from 'moment-timezone';
import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import actions from 'redux/intakeReceiptLog/actions';
import modalActions from 'redux/modal/actions';
import scannersActions from 'redux/scanners/actions';
import sessionActions from 'redux/scanSessions/actions';
import { constants } from 'utils/constants';
import { getColorIntakeLog } from 'utils/highlighting';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const IntakeReceiptLog = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [sortBy, setSortBy] = useState(undefined);

  const intakeLog = useSelector((state) => state.intakeReceiptLog);

  const {
    activeSessionId,
    isLoading: isSessionLoading,
    intakeLogs,
    companyInfoLoading,
  } = useSelector((state) => state.scanSessions.singleSession);

  const scanners = useSelector((state) => state.scanners.all);

  const fetchScanners = useCallback(() => {
    dispatch({
      type: scannersActions.FETCH_SCANNERS_REQUEST,
    });
  }, [dispatch]);

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_INTAKE_LOG_REQUEST,
        payload: {
          limit: constants?.intakeLog?.itemsLoadingCount,
          sort_by: sortBy,
        },
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy]);

    useEffect(() => {
      dispatch({
        type: sessionActions.FETCH_SESSION_ID_REQUEST,
        payload: {
          callback: fetchScanners,
        },
      });
    }, []);
  };

  useFetching();

  const startSession = useCallback(
    (logId) => ({ key }) => {
      dispatch({
        type: sessionActions.CREATE_SESSION_REQUEST,
        payload: {
          intakeLog: logId,
          scanner: key,
        },
      });
    },
    [dispatch],
  );

  const scannerMenu = (logId) => (
    <Menu onClick={startSession(logId)}>
      {scanners.items.map((item) => (
        <Menu.Item
          key={item.id}
          disabled={!item.is_active || !item.is_online}
          className={
            (!item.is_active || !item.is_online) && styles.disabledScanner
          }
        >
          <p style={{ margin: 0 }}>
            {item.scanner_id} – model:{item.model}{' '}
            {!item.is_online ? (
              <span style={{ color: 'red' }}>(offline)</span>
            ) : (
              ''
            )}
          </p>
        </Menu.Item>
      ))}
    </Menu>
  );

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter) {
      setSortBy(
        // eslint-disable-next-line no-nested-ternary
        sorter.order
          ? sorter.order === 'ascend'
            ? `${sorter.field}`
            : `-${sorter.field}`
          : undefined,
      );
    }
  };

  const handleReset = useCallback(() => {
    form.resetFields();
  }, [form]);

  const handleChangeIntake = useCallback(
    async (record) => {
      const fieldValues = await form.validateFields();

      const formattedValues = {
        ...omit(fieldValues, ['company_name', 'company_short']),
        shipped_on: moment(fieldValues.shipped_on).format('YYYY-MM-DD'),
        shipping_violations: fieldValues.shipping_violations?.map((item) => ({
          violation: item,
        })),
      };

      if (record) {
        dispatch({
          type: actions.PATCH_INTAKE_REQUEST,
          payload: {
            intake: {
              ...formattedValues,
              id: record.id,
            },
            resetForm: handleReset,
          },
        });
      } else {
        dispatch({
          type: actions.CREATE_INTAKE_REQUEST,
          payload: {
            intake: formattedValues,
            resetForm: handleReset,
          },
        });
      }
    },
    [dispatch, form, handleReset],
  );

  const handleModalToggle = useCallback(
    (record) => {
      if (record) {
        form.setFieldsValue({
          ...record.company,
          ...record,
          shipped_on: moment(record.shipped_on),
          shipping_violations: record.shipping_violations?.map(
            (item) => item.violation,
          ),
        });
      }

      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'COMPLIANCE_MODAL',
        modalProps: {
          title: `${record ? 'Edit' : 'New'} Log`,
          onOk: () => handleChangeIntake(record),
          bodyStyle: {
            maxHeight: '70vh',
            overflow: 'scroll',
          },
          width: '100%',
          okText: `${record ? 'Edit' : 'New'} Log`,
          message: () => <IntakeReceiptLogModal form={form} edit={!!record} />,
          maskClosable: false,
          onCancel: handleReset,
        },
      });
    },
    [dispatch, form, handleChangeIntake, handleReset],
  );

  const columns = [
    {
      title: 'Log DateTime',
      dataIndex: 'created',
      sorter: true,
      render: (value) => {
        return value ? moment(value).format('lll') : '-';
      },
    },
    {
      title: 'Company Name',
      dataIndex: 'company_name',
    },
    {
      title: 'Company Short',
      dataIndex: 'company_short',
    },
    {
      title: 'Company ID',
      dataIndex: 'company_id',
    },
    {
      title: 'Sample Count',
      dataIndex: 'reference_samples_count',
    },
    {
      title: 'Pool Count',
      dataIndex: 'reference_pools_count',
    },
    {
      title: 'Logged By',
      dataIndex: 'logged_by',
      render: (_, record) => {
        return record.logged_by ?? '-';
      },
    },
    {
      title: 'Shipped On',
      dataIndex: 'shipped_on',
      render: (value) => {
        return value ? moment(value).format('YYYY-MM-DD') : '-';
      },
    },
    {
      title: 'Shipping By',
      dataIndex: 'shipment',
    },
    {
      title: 'Shipping Condition',
      dataIndex: 'shipping_condition',
      // eslint-disable-next-line camelcase
      render: (value, { shipping_violations }) => {
        const taggedValue = <Tag color={getColorIntakeLog(value)}>{value}</Tag>;
        if (shipping_violations.length) {
          return (
            <Popover
              content={shipping_violations
                ?.map((item) => item.violation)
                .join(', ')}
              title="Violations"
              trigger="hover"
              placement="top"
              overlayClassName={styles.popover}
            >
              <div className={styles.comments}>
                {taggedValue}
                <CommentOutlined />
              </div>
            </Popover>
          );
        }
        return taggedValue;
      },
    },
    {
      title: 'Packing Slip Condition',
      dataIndex: 'packing_slip_condition',
      render: (value) => {
        return <Tag color={getColorIntakeLog(value)}>{value}</Tag>;
      },
    },
    {
      title: 'Total packing slips',
      dataIndex: 'total_packing_slips',
    },
    {
      title: 'Sample Condition',
      dataIndex: 'sample_condition',
      render: (value, { comments }) => {
        const taggedValue = <Tag color={getColorIntakeLog(value)}>{value}</Tag>;
        if (comments) {
          return (
            <Popover
              content={comments}
              title="Comments"
              trigger="hover"
              placement="top"
              overlayClassName={styles.popover}
            >
              <div className={styles.comments}>
                {taggedValue}
                <CommentOutlined />
              </div>
            </Popover>
          );
        }
        return taggedValue;
      },
    },
    {
      title: 'Tracking Number',
      dataIndex: 'tracking_numbers',
      wordWrap: 'break-word',
      wordBreak: 'break-word',
      width: '150px',
      render: (_, record) => {
        return record.tracking_numbers?.join(', ') ?? '-';
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'right',
      // width: 70,
      render: (_, record) => {
        return (
          <Space>
            <Button type="primary" onClick={() => handleModalToggle(record)}>
              Edit
            </Button>
            {/* {moment(record.created).isSame(moment(), 'day') && ( */}
            <Dropdown overlay={scannerMenu(record.id)} trigger="click">
              <Button
                type="primary"
                loading={isSessionLoading || scanners.isLoading}
              >
                Start session
                <DownOutlined />
              </Button>
            </Dropdown>
            {/* )} */}
          </Space>
        );
      },
    },
  ];

  const data = intakeLog.items.map?.((intakeItem) => ({
    ...intakeItem,
    company_name: intakeItem.company?.name,
    company_short: intakeItem.company?.name_short,
    company_id: intakeItem.company?.company_id,
  }));

  const loadMore = useCallback(() => {
    dispatch({
      type: actions.FETCH_INTAKE_LOG_REQUEST,
      payload: {
        limit: constants?.intakeLog?.itemsLoadingCount,
        offset: intakeLog.offset,
        sort_by: sortBy,
      },
    });
  }, [dispatch, intakeLog, sortBy]);

  if (!isSessionLoading && activeSessionId) {
    return <Redirect to={`/session/${activeSessionId}`} />;
  }

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Intake Receipt Log</h4>
        <Button
          type="primary"
          onClick={() => handleModalToggle(null)}
          className="mb-2"
        >
          Add New Log
        </Button>
      </div>
      <InfiniteScroll
        next={loadMore}
        hasMore={intakeLog.items.length < intakeLog.total}
        dataLength={intakeLog.items.length}
      >
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: 'max-content' }}
          bordered
          loading={intakeLog.isLoading}
          rowKey={(record) => record.id}
          onChange={handleTableChange}
        />
      </InfiniteScroll>
    </>
  );
};

export default IntakeReceiptLog;
