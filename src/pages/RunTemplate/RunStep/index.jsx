import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  notification,
  Radio,
  Row,
  Table,
} from 'antd';
import moment from 'moment-timezone';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import modalActions from 'redux/modal/actions';
import rules from 'utils/rules';
import layoutHook from '../layoutHook';
import values from '../params';
import PoolRackDetail from '../PoolRackDetail';
import PoolRackTable from '../PoolRackTable';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const RunStep = ({ runState, componentDispatch, initialValues, form }) => {
  const { kfpParam, replicationParam } = initialValues;
  const { Item } = Form;
  const dispatch = useDispatch();

  const [selectedRows, setSelectedRows] = useState([]);
  // TODO: how to avoid this?
  const stateRef = useRef();
  stateRef.current = selectedRows;

  const [poolRackLimit, setPoolRackLimit] = useState({});

  useEffect(() => {
    const limit = layoutHook(runState.kfpParam);
    setPoolRackLimit(limit);
  }, [runState.kfpParam]);

  const handleChangeLayout = useCallback(
    (e) => {
      const { value, name } = e.target;

      componentDispatch({
        type: 'setValue',
        payload: { name, value },
      });

      if (name === 'kfpParam') {
        componentDispatch({
          type: 'setValue',
          payload: {
            name: 'poolRacks',
            value: [],
          },
        });

        if (value === values.twoKFPs) {
          form.setFieldsValue({ replicationParam: values.duplicate });
          componentDispatch({
            type: 'setValue',
            payload: {
              name: 'replicationParam',
              value: values.duplicate,
            },
          });
        }
      }
    },
    [componentDispatch, form],
  );

  const columns = [
    {
      title: 'PoolRack Name',
      dataIndex: 'scan_name',
      ellipsis: true,
    },
    {
      title: 'PoolRack RackID',
      dataIndex: 'rack_id',
    },
    {
      title: `Scan Timestamp`,
      dataIndex: 'scan_timestamp',
      render: (_, value) => {
        return moment(value?.scan_timestamp).format('llll') ?? '-';
      },
    },
    {
      title: 'Actions',
      render: (text, record) => (
        // <Space size="middle">
        <Button type="link" onClick={() => openModalDetail(record.id)}>
          View plate
        </Button>
        // <a>Delete</a>
        // </Space>
      ),
    },
  ];

  const updatePoolRacks = useCallback(() => {
    componentDispatch({
      type: 'setValue',
      payload: {
        name: 'poolRacks',
        value: stateRef.current,
      },
    });
    dispatch({ type: modalActions.HIDE_MODAL });
    setSelectedRows([]);
  }, [dispatch, componentDispatch]);

  const resetSelectedRows = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const openModalList = useCallback(
    (runState, poolRackLimit) => {
      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'COMPLIANCE_MODAL',
        modalProps: {
          title: 'Select PoolRacks',
          bodyStyle: {
            maxHeight: '70vh',
            overflow: 'scroll',
          },
          onOk: updatePoolRacks,
          message: () => (
            <PoolRackTable
              setSelectedRows={setSelectedRows}
              runState={runState}
              limit={poolRackLimit}
            />
          ),
          width: '100%',
          onCancel: resetSelectedRows,
        },
      });
    },
    [dispatch, updatePoolRacks, resetSelectedRows],
  );

  const openModalDetail = useCallback(
    (poolRackId) => {
      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'COMPLIANCE_MODAL',
        modalProps: {
          title: 'PoolRack',
          bodyStyle: {
            maxHeight: '70vh',
            overflow: 'scroll',
          },
          message: () => <PoolRackDetail id={poolRackId} />,
          width: '100%',
          footer: null,
        },
      });
    },
    [dispatch],
  );

  const onSubmit = useCallback(
    (values) => {
      if (
        runState.poolRacks.length < poolRackLimit.min ||
        runState.poolRacks.length > poolRackLimit.max
      ) {
        return notification.error({
          message: 'Wrong number of PoolRacks per run',
          description: `Select ${poolRackLimit.min} – ${poolRackLimit.max} PoolRacks`,
        });
      }
      return componentDispatch({
        type: 'setValue',
        payload: {
          name: 'currentStep',
          value: 1,
        },
      });
    },
    [componentDispatch, runState, poolRackLimit],
  );

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          kfpParam,
          replicationParam,
          runTitle: '',
          reflex: false,
          rerun: false,
        }}
        onFinish={onSubmit}
      >
        <Row>
          <Col xs={{ span: 16 }}>
            <Item name="kfpParam" rules={[rules.required]}>
              <Radio.Group
                name="kfpParam"
                onChange={handleChangeLayout}
                buttonStyle="solid"
              >
                <Radio.Button value={values.oneKFP} className={styles.radio}>
                  1 KingFisher Plate
                </Radio.Button>
                <Radio.Button value={values.twoKFPs} className={styles.radio}>
                  2 KingFisher Plate
                </Radio.Button>
              </Radio.Group>
            </Item>
            <Item name="replicationParam" rules={[rules.required]}>
              <Radio.Group
                name="replicationParam"
                onChange={handleChangeLayout}
                buttonStyle="solid"
              >
                <Radio.Button value={values.duplicate} className={styles.radio}>
                  Duplicate
                </Radio.Button>
                <Radio.Button
                  value={values.triplicate}
                  className={styles.radio}
                  disabled={runState.kfpParam === values.twoKFPs}
                >
                  Triplicate
                </Radio.Button>
              </Radio.Group>
            </Item>
            <Table
              columns={columns}
              dataSource={runState.poolRacks}
              pagination={false}
              scroll={{ x: 'max-content' }}
              bordered
              rowKey={(record) => record.id}
              className="mt-5 mb-5"
              title={() => (
                <Button
                  type="primary"
                  onClick={() => openModalList(runState, poolRackLimit)}
                >
                  Select PoolRacks
                </Button>
              )}
            />

            <Item name="reflex" valuePropName="checked" className="mb-0">
              <Checkbox>Reflex</Checkbox>
            </Item>
            <Item name="rerun" valuePropName="checked">
              <Checkbox>Rerun</Checkbox>
            </Item>
          </Col>
          <Col>
            <Item label="Run title" name="runTitle" rules={[rules.required]}>
              <Input placeholder="Run title" />
            </Item>
          </Col>
        </Row>

        <Item>
          <Button type="primary" size="large" htmlType="submit">
            Review run
          </Button>
        </Item>
      </Form>
    </>
  );
};

RunStep.propTypes = {
  runState: PropTypes.shape({}).isRequired,
  componentDispatch: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({}).isRequired,
  form: PropTypes.shape({}).isRequired,
};

export default RunStep;
