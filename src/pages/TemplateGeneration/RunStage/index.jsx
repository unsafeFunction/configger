import { Alert, Button, Checkbox, Form, Input } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/templateGeneration/actions';
import { rules } from 'utils/rules';
import values from '../params';
import { layout } from './utils';

const RunStage = ({ runState, componentDispatch }) => {
  const { Item } = Form;

  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.templateGeneration);

  const selectedPoolRacks = runState.poolRacks.filter((item) => item.id).length;
  const validation =
    (runState.kfpParam === values.oneKFP && selectedPoolRacks > 0) ||
    (runState.kfpParam === values.twoKFPs && selectedPoolRacks > 2);

  const onSubmit = useCallback(
    (values) => {
      dispatch({
        type: actions.CREATE_TEMPLATE_REQUEST,
        payload: { ...runState, ...values },
      });
    },
    [dispatch, runState],
  );

  return (
    <Form
      layout="vertical"
      labelCol={layout}
      wrapperCol={layout}
      initialValues={{
        reflex: false,
        rerun: false,
      }}
      onFinish={onSubmit}
    >
      {!validation && (
        <Item>
          <Alert
            message="Warning"
            description="Insufficient number of PoolRacks per run."
            type="warning"
            showIcon
          />
        </Item>
      )}
      <Item label="Run title" name="runTitle" rules={[rules.required]}>
        <Input placeholder="Run title" />
      </Item>
      <Item name="reflex" valuePropName="checked" className="mb-0">
        <Checkbox>Reflex</Checkbox>
      </Item>
      <Item name="rerun" valuePropName="checked">
        <Checkbox>Rerun</Checkbox>
      </Item>
      <Item>
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          loading={isLoading}
          disabled={!validation}
          className="w-100"
        >
          Submit
        </Button>
      </Item>
    </Form>
  );
};

RunStage.propTypes = {
  runState: PropTypes.shape({}).isRequired,
  componentDispatch: PropTypes.func.isRequired,
};

export default RunStage;
