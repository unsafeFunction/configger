/* eslint-disable prettier/prettier */

import {
  Button,
  Col,
  Empty,
  Form,
  Input,
  notification,
  Radio,
  Row,
  Select,
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
import { qsMachines, runTypes, startColumns, values } from '../params';
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
  const [runNumber, setRunNumber] = useState(form.getFieldValue('runNumber'));

  useEffect(() => {
    const limit = layoutHook(runState.kfpParam);
    setPoolRackLimit(limit);
  }, [runState.kfpParam]);

  const isPoolsSelected = runState.poolRacks.length >= 1;
  const isRunNumber = runNumber?.length > 0;

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
        <Button type="link" onClick={() => openModalDetail(record.id)}>
          View plate
        </Button>
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

  const onSubmit = useCallback(() => {
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
  }, [componentDispatch, runState, poolRackLimit]);

  const handleChangeRunNumber = useCallback((event) => {
    setRunNumber(event.target.value);
  }, []);

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          kfpParam,
          replicationParam,
          runNumber: '',
        }}
        onFinish={onSubmit}
      >
        <Row>
          <Col xs={{ span: 12 }}>
            <Item name="method" rules={[rules.required]}>
              <Radio.Group name="method" buttonStyle="solid">
                <Radio.Button
                  value={values.SalivaClear}
                  className={styles.radio}
                >
                  SalivaClear
                </Radio.Button>
                <Radio.Button
                  value={values.SalivaDirect}
                  className={styles.radio}
                >
                  SalivaDirect
                </Radio.Button>
              </Radio.Group>
            </Item>
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
          </Col>
          <Col xs={{ span: 12 }}>
            <Item name="startColumn" rules={[rules.required]}>
              <Select
                placeholder="Start column"
                showArrow
                optionFilterProp="label"
                allowClear
                showSearch
                options={startColumns(1, 23)}
              />
            </Item>
            <Item name="runNumber" rules={[rules.required]}>
              <Input
                placeholder="Run number"
                onChange={handleChangeRunNumber}
                className={styles.runNumber}
              />
            </Item>
            <Item name="runType" rules={[rules.required]}>
              <Select
                placeholder="Run type"
                showArrow
                optionFilterProp="label"
                allowClear
                showSearch
                options={runTypes}
              />
            </Item>
            <Item name="qsMachine" rules={[rules.required]}>
              <Select
                placeholder="QS machine"
                showArrow
                optionFilterProp="label"
                allowClear
                showSearch
                options={qsMachines}
              />
            </Item>
          </Col>
        </Row>
        {isPoolsSelected && (
          <div className={styles.editPoolRacks}>
            <Button
              type="primary"
              onClick={() => openModalList(runState, poolRackLimit)}
            >
              Edit PoolRacks List
            </Button>
          </div>
        )}
        <Item>
          <Table
            columns={columns}
            dataSource={runState.poolRacks}
            pagination={false}
            scroll={{ x: 'max-content' }}
            bordered
            rowKey={(record) => record.id}
            className="mt-3"
            locale={{
              emptyText: () => (
                <Empty
                  image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                  imageStyle={{
                    height: 60,
                  }}
                  description={<span>No PoolRacks selected</span>}
                >
                  <Button
                    type="primary"
                    className="mb-3"
                    onClick={() => openModalList(runState, poolRackLimit)}
                  >
                    Select PoolRacks
                  </Button>
                </Empty>
              ),
            }}
          />
        </Item>
        <Item>
          <Button
            disabled={!isPoolsSelected || !isRunNumber}
            type="primary"
            htmlType="submit"
          >
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
