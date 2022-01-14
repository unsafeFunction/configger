import { Button, Card, Col, Row, Space, Typography } from 'antd';
import moment from 'moment-timezone';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import modalActions from 'redux/modal/actions';
import actions from 'redux/runTemplate/actions';
import { constants } from 'utils/constants';
import PoolRackDetail from '../PoolRackDetail';
import ReviewTable from './components';

const ReviewStep = ({ runState, componentDispatch, form }) => {
  const { kfpParam, replicationParam, poolRacks } = runState;

  const { Text } = Typography;

  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.runTemplate);

  const openModalDetail = useCallback(
    (poolRack) => {
      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'COMPLIANCE_MODAL',
        modalProps: {
          title: `PoolRack ${poolRack.rack_id}`,
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

  const dataTable = [
    {
      key: 1,
      id: 1,
      method: form.getFieldValue('method'),
      start_column: form.getFieldValue('startColumn'),
      run_type: form.getFieldValue('runType'),
      layout_type: `${kfpParam}/${replicationParam}`,
      run_number: form.getFieldValue('runNumber'),
      qs_machine: form.getFieldValue('qsMachine'),
    },
  ];
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
      <ReviewTable data={dataTable} />
      <Row gutter={[40, 40]} justify="center" className="mb-4">
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
                  onClick={() => openModalDetail(poolRack)}
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
                  ? moment(poolRack.scan_timestamp).format(
                      constants.dateTimeFormat,
                    )
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
        <Button onClick={handlePrevious} disabled={isLoading}>
          Edit run
        </Button>
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
