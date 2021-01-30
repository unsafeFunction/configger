import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/scan/actions';
import { Row, Col } from 'antd';
import Rackboard from 'components/widgets/rackboard';
import styles from './styles.module.scss';

const Scan = () => {
  const dispatch = useDispatch();
  const rackboard = useSelector(state => state.scan?.rackboard);

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_SAMPLES_REQUEST,
      });
    }, [dispatch]);
  };

  useFetching();

  return (
    <>
      <Row gutter={[40, 48]} justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Rackboard rackboard={rackboard} />
        </Col>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}></Col>
      </Row>
    </>
  );
};

export default Scan;
