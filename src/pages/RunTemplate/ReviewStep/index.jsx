import { Button, Card, Col, Row, Space, Typography } from 'antd';
import moment from 'moment-timezone';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import modalActions from 'redux/modal/actions';
import actions from 'redux/runTemplate/actions';
import PoolRackDetail from '../PoolRackDetail';

moment.tz.setDefault('America/New_York');

const ReviewStep = ({ runState, componentDispatch, form }) => {
  const { kfpParam, replicationParam, poolRacks } = runState;

  const { Text } = Typography;

  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.runTemplate);

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

  const handlePrevious = useCallback(() => {
    componentDispatch({
      type: 'setValue',
      payload: {
        name: 'currentStep',
        value: 0,
      },
    });
  }, [componentDispatch]);

  const generateRun = useCallback(() => {
    dispatch({
      type: actions.CREATE_TEMPLATE_REQUEST,
      payload: { ...runState, ...form.getFieldsValue(true) },
    });
  }, [dispatch, runState, form]);

  return (
    <div>
      {/* <Result
        status="success"
        title="Successfully generate run RUN_NAME!"
        subTitle="TODO RUN INFO"
        extra={[
          <Button type="primary" key="console">
            View runs
          </Button>,
          <Button key="buy">Generate new run</Button>,
        ]}
      /> */}
      <Space className="mb-4" direction="vertical">
        <Row>
          <Col className="mr-4">
            <Text strong>Method: &nbsp;</Text>
            <Text>{form.getFieldValue('method')}</Text>
          </Col>
          <Col>
            <Text strong>Layout type: &nbsp;</Text>
            <Text>{`${kfpParam}/${replicationParam}`}</Text>
          </Col>
        </Row>
        <Row>
          <Col className="mr-4">
            <Text strong>Start column: &nbsp;</Text>
            <Text>{form.getFieldValue('startColumn')}</Text>
          </Col>
          <Col>
            <Text strong>Run number: &nbsp;</Text>
            <Text>{form.getFieldValue('runNumber')}</Text>
          </Col>
        </Row>
        <Row>
          <Col className="mr-4">
            <Text strong>Run type: &nbsp;</Text>
            <Text>{form.getFieldValue('runType')}</Text>
          </Col>
          <Col>
            <Text strong>QS Machine: &nbsp;</Text>
            <Text>{form.getFieldValue('qsMachine')}</Text>
          </Col>
        </Row>
      </Space>
      <Row gutter={[40, 40]}>
        {poolRacks.map((poolRack, index) => (
          <Col
            xs={24}
            sm={20}
            md={16}
            lg={12}
            xl={10}
            xxl={9}
            key={poolRack.id}
          >
            <Card
              title={`PoolRack ${index + 1}`}
              extra={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <a
                  className="text-primary"
                  onClick={() => openModalDetail(poolRack.id)}
                >
                  View plate
                </a>
              }
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
      <Space size="middle">
        <Button type="primary" onClick={generateRun} loading={isLoading}>
          Generate run
        </Button>
        <Button onClick={handlePrevious}>Edit run</Button>
      </Space>
    </div>
  );
};

ReviewStep.propTypes = {
  runState: PropTypes.shape({}).isRequired,
  componentDispatch: PropTypes.func.isRequired,
  form: PropTypes.shape({}).isRequired,
};

export default ReviewStep;
