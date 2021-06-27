import { Button, Form, Radio } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import rules from 'utils/rules';
import values from '../params';
import styles from './styles.module.scss';
import layout from './utils';

const LayoutStage = ({ runState, componentDispatch, form, initialValues }) => {
  const { kfpParam, replicationParam } = initialValues;

  const handleChange = useCallback((e) => {
    const { value, name } = e.target;

    componentDispatch({
      type: 'setValue',
      payload: { name, value },
    });

    if (name === 'kfpParam') {
      if (value === values.oneKFP) {
        componentDispatch({
          type: 'setValue',
          payload: {
            name: 'poolRacks',
            value: Array(2).fill({}),
          },
        });
      } else if (value === values.twoKFPs) {
        componentDispatch({
          type: 'setValue',
          payload: {
            name: 'poolRacks',
            value: Array(4).fill({}),
          },
        });

        form.setFieldsValue({ replicationParam: values.duplicate });

        componentDispatch({
          type: 'setValue',
          payload: {
            name: 'replicationParam',
            value: values.duplicate,
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
        initialValues={{ kfpParam, replicationParam }}
        size="large"
        onFinish={onSubmit}
        labelCol={layout}
        wrapperCol={layout}
      >
        <Form.Item name="kfpParam" rules={[rules.required]}>
          <Radio.Group
            name="kfpParam"
            onChange={handleChange}
            className={styles.radioGroup}
            buttonStyle="solid"
          >
            <Radio.Button value={values.oneKFP} className={styles.radio}>
              1 KingFisher Plate
            </Radio.Button>
            <Radio.Button value={values.twoKFPs} className={styles.radio}>
              2 KingFisher Plate
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="replicationParam" rules={[rules.required]}>
          <Radio.Group
            name="replicationParam"
            onChange={handleChange}
            className={styles.radioGroup}
            buttonStyle="solid"
          >
            <Radio.Button value={values.duplicate} className={styles.radio}>
              Duplicate
            </Radio.Button>
            <Radio.Button
              value={values.triplicate}
              className={styles.radio}
              disabled={runState.kfpParam === values.twoKFPs}
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

LayoutStage.propTypes = {
  runState: PropTypes.shape({}).isRequired,
  componentDispatch: PropTypes.func.isRequired,
  form: PropTypes.shape({}).isRequired,
  initialValues: PropTypes.shape({}).isRequired,
};

export default LayoutStage;
