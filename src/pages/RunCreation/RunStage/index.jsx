import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Checkbox, Button } from 'antd';
import PropTypes from 'prop-types';
import { layout } from './utils';
import { rules } from 'utils/rules';
import styles from './styles.module.scss';

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
      <Item name="validation" valuePropName="checked">
        <Checkbox>Validation</Checkbox>
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
