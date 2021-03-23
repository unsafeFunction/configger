import React, { useCallback } from 'react';
import { Form, Button, Radio } from 'antd';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const Stage1 = ({ runState, componentDispatch }) => {
  const [form] = Form.useForm();

  const layout = {
    xs: { span: 24 },
    sm: { span: 16, offset: 4 },
    lg: { span: 12, offset: 6 },
    xl: { span: 10, offset: 7 },
    xxl: { span: 8, offset: 8 },
  };

  const handleChange = useCallback((e) => {
    const { target } = e;

    componentDispatch({
      type: 'setValue',
      payload: {
        name: target.name,
        value: target.value,
      },
    });

    if (target.name === 'param1') {
      if (target.value === '1-kingfisher') {
        componentDispatch({
          type: 'setValue',
          payload: {
            name: 'poolRacks',
            value: Array(2).fill({}),
          },
        });
      } else if (target.value === '2-kingfisher') {
        componentDispatch({
          type: 'setValue',
          payload: {
            name: 'poolRacks',
            value: Array(4).fill({}),
          },
        });

        form.setFieldsValue({ param2: 'duplicate' });

        componentDispatch({
          type: 'setValue',
          payload: {
            name: 'param2',
            value: 'duplicate',
          },
        });
      }
    }
  }, []);

  const onSubmit = useCallback((values) => {
    componentDispatch({
      type: 'setValue',
      payload: {
        name: 'currentStage',
        value: 1,
      },
    });
  }, []);

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          param1: runState.param1,
          param2: runState.param2,
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
            buttonStyle="solid"
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
            buttonStyle="solid"
          >
            <Radio.Button value="duplicate" className={styles.radio}>
              Duplicate
            </Radio.Button>
            <Radio.Button
              value="tri-plicate"
              className={styles.radio}
              disabled={runState.param1 === '2-kingfisher' ? true : false}
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
  runState: PropTypes.object.isRequired,
  componentDispatch: PropTypes.func.isRequired,
};

export default Stage1;
