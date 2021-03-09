import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/intakeReceiptLog/actions';
import modalActions from 'redux/modal/actions';
import { Table, Spin, Button, Form } from 'antd';
import moment from 'moment-timezone';
import classNames from 'classnames';
import InfiniteScroll from 'react-infinite-scroll-component';
import { constants } from 'utils/constants';
import IntakeRecepientLogModal from 'components/widgets/IntakeLog/IntakeRecepientLogModal';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const IntakeReceiptLog = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const intakeLog = useSelector(state => state.intakeReceiptLog);

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_INTAKE_LOG_REQUEST,
        payload: {
          limit: constants?.intakeLog?.itemsLoadingCount,
        },
      });
    }, [dispatch]);
  };

  useFetching();

  const handleReset = useCallback(() => {
    form.resetFields();
  }, []);

  const handleChangeIntake = useCallback(async record => {
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
  }, []);

  const handleModalToggle = useCallback(
    record => {
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
          title: `${record ? 'Edit' : 'New'} intake`,
          onOk: () => handleChangeIntake(record),
          bodyStyle: {
            maxHeight: '70vh',
            overflow: 'scroll',
          },
          okText: `${record ? 'Edit' : 'New'} intake`,
          message: () => (
            <IntakeRecepientLogModal form={form} edit={!!record} />
          ),
          maskClosable: false,
          onCancel: handleReset,
          confirmLoading: intakeLog.isCreating,
        },
      });
    },
    [dispatch],
  );

  const columns = [
    {
      title: 'Log DateTime',
      dataIndex: 'modified',
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
      title: 'Tracking Number',
      dataIndex: 'tracking_number',
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

  const data = intakeLog.items.map?.(intakeItem => ({
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
      },
    });
  }, [dispatch, intakeLog]);

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
        // loader={
        //   <div className={styles.spin}>
        //     <Spin />
        //   </div>
        // }
        dataLength={intakeLog.items.length}
      >
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: 'max-content' }}
          bordered
          loading={intakeLog.isLoading}
          rowKey={record => record.id}
        />
      </InfiniteScroll>
    </>
  );
};

export default IntakeReceiptLog;
