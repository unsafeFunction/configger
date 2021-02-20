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

  const handleModalToggle = useCallback(() => {
    dispatch({
      type: modalActions.SHOW_MODAL,
      modalType: 'COMPLIANCE_MODAL',
      modalProps: {
        title: 'New intake',
        onOk: createIntake,
        bodyStyle: {
          maxHeight: '70vh',
          overflow: 'scroll',
        },
        okText: 'Add intake',
        message: () => <IntakeRecepientLogModal form={form} />,
        maskClosable: false,
        onCancel: handleReset,
      },
    });
  }, [dispatch]);

  const createIntake = useCallback(async () => {
    const fieldValues = await form.validateFields();
    dispatch({
      type: actions.CREATE_INTAKE_REQUEST,
      payload: {
        intake: fieldValues,
        resetForm: handleReset,
      },
    });
  }, []);

  const handleReset = useCallback(() => {
    form.resetFields();
  }, []);

  const columns = [
    {
      title: 'Log DateTime',
      dataIndex: 'created',
      render: (_, value) => {
        return moment(value).format('lll');
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
    },
    {
      title: 'Shipping By',
      dataIndex: 'shipment',
    },
    {
      title: 'Tracking Number',
      dataIndex: 'tracking_number',
    },
  ];

  const data = intakeLog.items.map?.(intakeItem => ({
    ...intakeItem,
    company_name: intakeItem.company?.name,
    company_short: intakeItem.company?.name_short,
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
        <Button type="primary" onClick={handleModalToggle} className="mb-2">
          Add New Log
        </Button>
      </div>
      <InfiniteScroll
        next={loadMore}
        hasMore={intakeLog.items.length < intakeLog.total}
        loader={
          <div className={styles.spin}>
            <Spin />
          </div>
        }
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
