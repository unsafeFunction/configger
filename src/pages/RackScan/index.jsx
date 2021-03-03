import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/racks/actions';
import modalActions from 'redux/modal/actions';
import { constants } from 'utils/constants';
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

  const rack = useSelector(state => state.racks?.singleRack);

  const onDataChange = useCallback(
    event => {
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
      },
    });
  }, [dispatch, rackId]);

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
  console.log(rack);
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
            <div className={styles.navigationWrapper}>
              <Button
                onClick={onSaveScanModalToggle}
                type="primary"
                htmlType="submit"
                disabled={!rack?.isLoading}
              >
                Submit
              </Button>
            </div>
            {/* TODO: why is using separately scanId */}
            <Rackboard isRack rackboard={rack} scanId={rack.id} />
          </div>
          <ScanStatistic isRack scan={rack} scansTotal={10} />
        </Col>
        <Col xs={24} md={18} lg={8} xl={10}>
          <Row className="mb-3 mt-5">
            <Typography.Text>Rack name</Typography.Text>
            <Input
              onChange={onDataChange}
              name="rack_id"
              placeholder="Pool rack name"
              value={rack.rack_id}
            />
          </Row>
          <Row>
            <Typography.Text>Orientation sign off</Typography.Text>
            <Input
              onChange={onDataChange}
              name="orientation_sign_off"
              placeholder="Orientation sign off"
              value={rack.orientation_sign_off}
            />
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default RackScan;
