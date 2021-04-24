import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/racks/actions';
import modalActions from 'redux/modal/actions';
import { Row, Col, Button, Typography, Input } from 'antd';
import Rackboard from 'components/widgets/Rackboard';
import ScanStatistic from 'components/widgets/Scans/ScanStatistic';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment-timezone';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const RackScan = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const rackId = history.location.pathname.split('/')[2];

  const rack = useSelector((state) => state.racks?.singleRack);

  const onDataChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      dispatch({
        type: actions.RACK_DATA_CHANGE,
        payload: {
          name,
          value,
        },
      });
    },
    [dispatch],
  );

  const saveRack = useCallback(() => {
    dispatch({
      type: actions.UPDATE_RACK_REQUEST,
      payload: {
        id: rackId,
        callback: () => history.push('/rack-scans'),
      },
    });
  }, [dispatch, rackId, history]);

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.GET_RACK_REQUEST,
        payload: rackId,
      });
    }, []);
  };

  useFetching();

  const onSaveScanModalToggle = useCallback(() => {
    dispatch({
      type: modalActions.SHOW_MODAL,
      modalType: 'COMPLIANCE_MODAL',
      modalProps: {
        title: 'Save pool rack',
        onOk: saveRack,
        bodyStyle: {
          maxHeight: '70vh',
          overflow: 'scroll',
        },
        okText: 'Save',
        message: () => <span>Are you sure to save pool rack?</span>,
      },
    });
  }, [dispatch, saveRack]);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <Typography.Title level={4} className="font-weight-normal">
          {`Scan on ${moment(rack?.scan_timestamp)?.format('LLLL') ?? ''}`}
        </Typography.Title>
      </div>
      <Row gutter={[48, 40]} justify="center">
        <Col xs={24} md={18} lg={16} xl={14}>
          <div className="mb-4">
            <Rackboard isRack rackboard={rack} scanId={rack.id} />
          </div>
          <ScanStatistic isRack scan={rack} />
        </Col>
        <Col xs={24} md={18} lg={8} xl={10}>
          <Row className="mb-3">
            <Typography.Text>PoolRack Name</Typography.Text>
            <Input
              onChange={onDataChange}
              name="rack_name"
              placeholder="PoolRack name"
              value={rack.rack_name}
            />
          </Row>
          <Row className="mb-3">
            <Typography.Text>Orientation sign off</Typography.Text>
            <Input
              onChange={onDataChange}
              name="orientation_sign_off"
              placeholder="Orientation sign off"
              maxLength={4}
              value={rack.orientation_sign_off}
            />
          </Row>
          <Row>
            <Button
              onClick={onSaveScanModalToggle}
              type="primary"
              htmlType="submit"
              disabled={rack?.isLoading}
              loading={rack?.isLoading}
            >
              Submit
            </Button>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default RackScan;
