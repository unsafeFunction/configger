import React, { useCallback } from 'react';
import { Form, Button, Radio, Typography } from 'antd';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const Stage1 = ({ state, componentDispatch, initialValues }) => {
  const [form] = Form.useForm();

  const layout = {
    xs: { span: 24 },
    sm: { span: 16, offset: 4 },
    lg: { span: 12, offset: 6 },
    xl: { span: 10, offset: 7 },
    xxl: { span: 8, offset: 8 },
  };

  const handleChange = useCallback(e => {
    componentDispatch({
      type: 'setValue',
      payload: {
        name: e.target.name,
        value: e.target.value,
      },
    });

    if (e.target.name === 'param1' && e.target.value === '2-kingfisher') {
      form.setFieldsValue({
        param2: 'duplicate',
      });

      componentDispatch({
        type: 'setValue',
        payload: {
          name: 'param2',
          value: 'duplicate',
        },
      });
    }
  }, []);

  const onSubmit = useCallback(values => {
    // console.log('Stage 1 values', values);
  }, []);

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          param1: initialValues.param1,
          param2: initialValues.param2,
        }}
        size="large"
        onFinish={onSubmit}
        labelCol={layout}
        wrapperCol={layout}
      >
        <Form.Item
          name="param1"
          rules={[
            {
              required: true,
              message: 'Required',
            },
          ]}
        >
          <Radio.Group
            name="param1"
            onChange={handleChange}
            className={styles.radioGroup}
          >
            <Radio.Button value="1-kingfisher" className={styles.radio}>
              1 KingFisher Plate
            </Radio.Button>
            <Radio.Button value="2-kingfisher" className={styles.radio}>
              2 KingFisher Plate
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="param2"
          rules={[
            {
              required: true,
              message: 'Required',
            },
          ]}
        >
          <Radio.Group
            name="param2"
            onChange={handleChange}
            className={styles.radioGroup}
          >
            <Radio.Button value="duplicate" className={styles.radio}>
              Duplicate
            </Radio.Button>
            <Radio.Button
              value="tri-plicate"
              className={styles.radio}
              disabled={state.param1 === '2-kingfisher' ? true : false}
            >
              Triplicate
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            // loading={}
            className="w-100"
          >
            Сontinue
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

Stage1.propTypes = {
  state: PropTypes.object.isRequired,
  componentDispatch: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
};

export default Stage1;
