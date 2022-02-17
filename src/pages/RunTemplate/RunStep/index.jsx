/* eslint-disable prettier/prettier */
import { MenuOutlined } from '@ant-design/icons';
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
import arrayMove from 'array-move';
import moment from 'moment-timezone';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import modalActions from 'redux/modal/actions';
import { constants } from 'utils/constants';
import rules from 'utils/formRules';
import labConfig from 'utils/labConfig';
import layoutHook from '../layoutHook';
import { qsMachines, runTypes, startColumns, values } from '../params';
import PoolRackDetail from '../PoolRackDetail';
import PoolRackTable from '../PoolRackTable';
import { rowCounter } from 'utils/tableFeatures';
import styles from './styles.module.scss';

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

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

  const isPoolsSelected = runState.poolRacks.length >= 1;

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
    (poolRack) => {
      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'COMPLIANCE_MODAL',
        modalProps: {
          title: `${labConfig[process.env.REACT_APP_LAB_ID].naming.rack} ${
            poolRack.rack_id
          }`,
          bodyStyle: {
            maxHeight: '70vh',
            overflow: 'scroll',
          },
          message: () => <PoolRackDetail id={poolRack.id} />,
          width: '100%',
          footer: null,
        },
      });
    },
    [dispatch],
  );

  const DragHandle = sortableHandle(() => (
    <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
  ));

  const columns = [
    rowCounter,
    {
      title: 'Sort',
      dataIndex: 'sort',
      width: 30,
      align: 'center',
      render: () => <DragHandle />,
    },
    {
      title: `${labConfig[process.env.REACT_APP_LAB_ID].naming.rack} Name`,
      dataIndex: 'scan_name',
      ellipsis: true,
    },
    {
      title: `${labConfig[process.env.REACT_APP_LAB_ID].naming.rack} RackID`,
      dataIndex: 'rack_id',
    },
    {
      title: `Scan Timestamp`,
      dataIndex: 'scan_timestamp',
      render: (value) =>
        value ? moment(value).format(constants.dateTimeFormat) : '-',
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Button type="link" onClick={() => openModalDetail(record)}>
          View plate
        </Button>
      ),
    },
  ];

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const dataSource = runState.poolRacks;
    if (oldIndex !== newIndex) {
      const newData = arrayMove(
        [].concat(dataSource),
        oldIndex,
        newIndex,
      ).filter((el) => !!el);

      componentDispatch({
        type: 'setValue',
        payload: {
          name: 'poolRacks',
          value: newData,
        },
      });
    }
  };

  const DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass={styles.rowDragging}
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const dataSource = runState.poolRacks;
    const index = dataSource.findIndex(
      (x) => x.id === restProps['data-row-key'],
    );
    return <SortableItem index={index} {...restProps} />;
  };

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
          title: `Select ${
            labConfig[process.env.REACT_APP_LAB_ID].naming.rack
          }s`,
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
        message: `Wrong number of ${
          labConfig[process.env.REACT_APP_LAB_ID].naming.rack
        }s per run`,
        description: `Select ${poolRackLimit.min} - ${poolRackLimit.max} ${
          labConfig[process.env.REACT_APP_LAB_ID].naming.rack
        }s`,
        duration: 0,
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

  return (
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
      <Row gutter={[24, 16]}>
        <Col
          xs={24}
          sm={{ span: 16, offset: 4 }}
          lg={{ span: 12, offset: 0 }}
          xxl={{ span: 10 }}
        >
          <Item name="method" rules={[rules.required]}>
            <Radio.Group
              name="method"
              buttonStyle="solid"
              className={styles.radioGroup}
            >
              <Radio.Button value={values.SalivaClear}>
                SalivaClear
              </Radio.Button>
              <Radio.Button value={values.SalivaDirect}>
                SalivaDirect
              </Radio.Button>
              <Radio.Button value={values.Eurofins}>Eurofins</Radio.Button>
            </Radio.Group>
          </Item>
          <Item name="kfpParam" rules={[rules.required]}>
            <Radio.Group
              name="kfpParam"
              onChange={handleChangeLayout}
              buttonStyle="solid"
              className={styles.radioGroup}
            >
              <Radio.Button value={values.oneKFP}>
                1 KingFisher Plate
              </Radio.Button>
              <Radio.Button value={values.twoKFPs}>
                2 KingFisher Plate
              </Radio.Button>
            </Radio.Group>
          </Item>
          <Item name="replicationParam" rules={[rules.required]}>
            <Radio.Group
              name="replicationParam"
              onChange={handleChangeLayout}
              buttonStyle="solid"
              className={styles.radioGroup}
            >
              <Radio.Button value={values.duplicate}>Duplicate</Radio.Button>
              <Radio.Button
                value={values.triplicate}
                disabled={runState.kfpParam === values.twoKFPs}
              >
                Triplicate
              </Radio.Button>
            </Radio.Group>
          </Item>
        </Col>
        <Col
          xs={24}
          sm={{ span: 16, offset: 4 }}
          lg={{ span: 6, offset: 0 }}
          xxl={{ span: 5, offset: 4 }}
        >
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
            <Input placeholder="Run number" className={styles.runNumber} />
          </Item>
        </Col>
        <Col
          xs={24}
          sm={{ span: 16, offset: 4 }}
          lg={{ span: 6, offset: 0 }}
          xxl={{ span: 5 }}
        >
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
            {`Edit ${
              labConfig[process.env.REACT_APP_LAB_ID].naming.rack
            }s List`}
          </Button>
        </div>
      )}
      <Item>
        <Table
          columns={columns}
          dataSource={runState.poolRacks}
          pagination={false}
          scroll={{ x: 'max-content' }}
          rowKey={(record) => record.id}
          className="mt-3"
          locale={{
            emptyText: () => (
              <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{ height: 60 }}
                description={`No ${
                  labConfig[process.env.REACT_APP_LAB_ID].naming.rack
                }s selected`}
              >
                <Button
                  type="primary"
                  className="mb-3"
                  onClick={() => openModalList(runState, poolRackLimit)}
                >
                  {`Select ${
                    labConfig[process.env.REACT_APP_LAB_ID].naming.rack
                  }s`}
                </Button>
              </Empty>
            ),
          }}
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        />
      </Item>
      <Item>
        <Button disabled={!isPoolsSelected} type="primary" htmlType="submit">
          Review run
        </Button>
      </Item>
    </Form>
  );
};

RunStep.propTypes = {
  runState: PropTypes.shape({}).isRequired,
  componentDispatch: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({}).isRequired,
  form: PropTypes.shape({}).isRequired,
};

export default RunStep;
