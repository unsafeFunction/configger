import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import modalActions from 'redux/modal/actions';
import { Row, Col, Card, Typography } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment-timezone';
import PoolRackTable from './PoolRackTable';
import PoolRack from './PoolRack';
import isEmpty from 'lodash.isempty';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { Text } = Typography;

const Stage2 = ({ runState, componentDispatch }) => {
  const dispatch = useDispatch();

  const [selectedPoolRack, setPoolRack] = useState({});
  // TODO: leave ref here
  const stateRef = useRef();
  stateRef.current = selectedPoolRack;

  const poolRacks = useSelector((state) => state.racks.racks);

  const addPoolRack = useCallback((poolRack, poolRackPosition, runState) => {
    const poolRacks = [...runState.poolRacks];
    poolRacks.splice(poolRackPosition, 1, poolRack);

    componentDispatch({
      type: 'setValue',
      payload: {
        name: 'poolRacks',
        value: poolRacks,
      },
    });

    dispatch({ type: modalActions.HIDE_MODAL });
  }, []);

  const removePoolRack = useCallback((poolRackPosition, runState) => {
    const poolRacks = [...runState.poolRacks];
    poolRacks.splice(poolRackPosition, 1, {});

    componentDispatch({
      type: 'setValue',
      payload: {
        name: 'poolRacks',
        value: poolRacks,
      },
    });
  }, []);

  const handleModalTable = useCallback(
    (poolRackPosition, runState) => {
      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'COMPLIANCE_MODAL',
        modalProps: {
          title: 'Select PoolRack',
          bodyStyle: {
            maxHeight: '70vh',
            overflow: 'scroll',
          },
          okText: 'Continue',
          // okButtonProps: {
          //   disabled: isEmpty(stateRef.current),
          // },
          onOk: () => addPoolRack(stateRef.current, poolRackPosition, runState),
          message: () => (
            <PoolRackTable setPoolRack={setPoolRack} runState={runState} />
          ),
          width: '100%',
        },
      });
    },
    [dispatch, poolRacks, selectedPoolRack, addPoolRack],
  );

  const handleModalPoolRack = useCallback(
    (poolRackId) => {
      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'COMPLIANCE_MODAL',
        modalProps: {
          title: 'PoolRack',
          // onOk: () => console.log('OK - Modal - View Rack'),
          bodyStyle: {
            maxHeight: '70vh',
            overflow: 'scroll',
          },
          message: () => <PoolRack poolRackId={poolRackId} />,
          width: '100%',
        },
      });
    },
    [dispatch],
  );

  return (
    <>
      <Row gutter={[40, 56]} justify="center">
        {runState.poolRacks.map((poolRack, index) => (
          <Col xs={24} sm={20} md={16} lg={12} xl={10} xxl={9} key={index}>
            <Card
              title={`PoolRack ${index + 1}`}
              extra={
                <a
                  className="text-primary"
                  onClick={() => handleModalTable(index, runState)}
                >
                  Select PoolRack
                </a>
              }
              actions={[
                <EyeOutlined
                  key="view"
                  onClick={() =>
                    !isEmpty(poolRack) && handleModalPoolRack(poolRack.id)
                  }
                />,
                <DeleteOutlined
                  key="remove"
                  onClick={() =>
                    !isEmpty(poolRack) && removePoolRack(index, runState)
                  }
                />,
              ]}
              className={!isEmpty(poolRack) && styles.filled}
            >
              <p>
                <Text type="secondary">PoolRack ID: </Text>
                {poolRack.rack_id ?? '-'}
              </p>
              <p>
                <Text type="secondary">PoolRack Name: </Text>-
              </p>
              <p>
                <Text type="secondary">Updated Time: </Text>
                {poolRack.scan_timestamp
                  ? moment(poolRack.scan_timestamp).format('lll')
                  : '-'}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Stage2;
