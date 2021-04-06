import { Button, Form, Radio } from 'antd';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { rules } from 'utils/rules';
import styles from './styles.module.scss';
import { layout } from './utils';

const LayoutStage = ({ runState, componentDispatch, form, initialValues }) => {
  const { kfpParam, replicationParam } = initialValues;

  const handleChange = useCallback((e) => {
    const { value, name } = e.target;

    componentDispatch({
      type: 'setValue',
      payload: { name, value },
    });

    if (name === 'kfpParam') {
      if (value === '1_KINGFISHER_PLATE') {
        componentDispatch({
          type: 'setValue',
          payload: {
            name: 'poolRacks',
            value: Array(2).fill({}),
          },
        });
      } else if (value === '2_KINGFISHER_PLATE') {
        componentDispatch({
          type: 'setValue',
          payload: {
            name: 'poolRacks',
            value: Array(4).fill({}),
          },
        });

        form.setFieldsValue({ replicationParam: 'DUPLICATE' });

        componentDispatch({
          type: 'setValue',
          payload: {
            name: 'replicationParam',
            value: 'DUPLICATE',
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
            <Radio.Button value="1_KINGFISHER_PLATE" className={styles.radio}>
              1 KingFisher Plate
            </Radio.Button>
            <Radio.Button value="2_KINGFISHER_PLATE" className={styles.radio}>
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
            <Radio.Button value="DUPLICATE" className={styles.radio}>
              Duplicate
            </Radio.Button>
            <Radio.Button
              value="TRIPLICATE"
              className={styles.radio}
              disabled={runState.kfpParam === '2_KINGFISHER_PLATE'}
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
