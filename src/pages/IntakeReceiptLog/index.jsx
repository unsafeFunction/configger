import { Button, Form, Table } from 'antd';
import classNames from 'classnames';
import IntakeReceiptLogModal from 'components/widgets/IntakeLog/IntakeReceiptLogModal';
import moment from 'moment-timezone';
import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/intakeReceiptLog/actions';
import modalActions from 'redux/modal/actions';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const IntakeReceiptLog = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [sortBy, setSortBy] = useState(undefined);

  const intakeLog = useSelector((state) => state.intakeReceiptLog);

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
  };

  useFetching();

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
      const { company_name, company_short, ...rest } = fieldValues;

      if (record) {
        dispatch({
          type: actions.PATCH_INTAKE_REQUEST,
          payload: {
            intake: { ...rest, id: record.id },
            resetForm: handleReset,
          },
        });
      } else {
        dispatch({
          type: actions.CREATE_INTAKE_REQUEST,
          payload: {
            intake: rest,
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
      title: 'Log ID',
      dataIndex: 'log_id',
      render: (_, record) => {
        return record.log_id ?? '-';
      },
    },
    {
      title: 'Log DateTime',
      dataIndex: 'modified',
      sorter: true,
      render: (_, record) => {
        return moment(record.modified).format('lll');
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
      title: 'Shipping By',
      dataIndex: 'shipment',
    },
    {
      title: 'Sample Condition',
      dataIndex: 'sample_condition',
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      width: '350px',
      wordWrap: 'break-word',
      wordBreak: 'break-word',
      render: (_, record) => {
        return record.comments ?? '-';
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
      title: 'Edit',
      dataIndex: 'edit',
      fixed: 'right',
      width: 70,
      render: (_, record) => {
        return (
          <Button type="primary" onClick={() => handleModalToggle(record)}>
            Edit
          </Button>
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
