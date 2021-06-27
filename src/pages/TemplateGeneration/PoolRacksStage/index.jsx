/* eslint-disable prettier/prettier */

import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Col, Row, Typography } from 'antd';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import modalActions from 'redux/modal/actions';
import PoolRack from './PoolRack';
import PoolRackTable from './PoolRackTable';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { Text } = Typography;

const PoolRacksStage = ({ runState, componentDispatch }) => {
  const dispatch = useDispatch();

  const [selectedPoolRack, setPoolRack] = useState({});
  // TODO: leave ref here
  const stateRef = useRef();
  stateRef.current = selectedPoolRack;

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

    setPoolRack({});
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

  const handleReset = useCallback(() => {
    setPoolRack({});
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
          onOk: () => addPoolRack(stateRef.current, poolRackPosition, runState),
          message: () => (
            <PoolRackTable setPoolRack={setPoolRack} runState={runState} />
          ),
          width: '100%',
          onCancel: handleReset,
        },
      });
    },
    [dispatch, addPoolRack, handleReset],
  );

  const handleModalPoolRack = useCallback(
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
          message: () => <PoolRack poolRackId={poolRackId} />,
          width: '100%',
          footer: null,
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
                    poolRack.id && handleModalPoolRack(poolRack.id)
                  }
                />,
                <DeleteOutlined
                  key="remove"
                  onClick={() => poolRack.id && removePoolRack(index, runState)}
                />,
              ]}
              className={poolRack.id && styles.filled}
            >
              <p>
                <Text type="secondary">PoolRack ID: </Text>
                {poolRack.rack_id ?? '-'}
              </p>
              <p>
                <Text type="secondary">PoolRack Name: </Text>
                {poolRack.scan_name ?? '-'}
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

PoolRacksStage.propTypes = {
  runState: PropTypes.shape({}).isRequired,
  componentDispatch: PropTypes.func.isRequired,
};

export default PoolRacksStage;
