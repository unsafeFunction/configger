import { Button, Checkbox, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { rules } from 'utils/rules';
import { layout } from './utils';

const RunStage = ({ runState, componentDispatch }) => {
  const { Item } = Form;

  return (
    <Form layout="vertical" labelCol={layout} wrapperCol={layout}>
      <Item label="Run title" name="run_title" rules={[rules.required]}>
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
          // loading={}
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
