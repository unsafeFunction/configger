import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Checkbox, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const Stage3 = ({ runState, componentDispatch }) => {
  const { Item } = Form;

  const layout = {
    xs: { span: 24 },
    sm: { span: 14, offset: 5 },
    lg: { span: 12, offset: 6 },
    xxl: { span: 8, offset: 8 },
  };

  return (
    <Form layout="vertical" labelCol={layout} wrapperCol={layout}>
      <Item
        label="Run title"
        name="run_title"
        rules={[
          {
            required: true,
            message: 'This field is required',
          },
        ]}
      >
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

Stage3.propTypes = {
  runState: PropTypes.object.isRequired,
  componentDispatch: PropTypes.func.isRequired,
};

export default Stage3;
