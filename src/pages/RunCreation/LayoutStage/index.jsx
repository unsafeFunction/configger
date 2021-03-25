import React, { useCallback } from 'react';
import { Form, Button, Radio } from 'antd';
import PropTypes from 'prop-types';
import { layout } from './utils';
import { rules } from 'utils/rules';
import styles from './styles.module.scss';

const LayoutStage = ({ runState, componentDispatch, form, initialValues }) => {
  const { kfpParam, qntParam } = initialValues;

  const handleChange = useCallback((e) => {
    const { value, name } = e.target;

    componentDispatch({
      type: 'setValue',
      payload: { name, value },
    });

    if (name === 'kfpParam') {
      if (value === '1-kingfisher') {
        componentDispatch({
          type: 'setValue',
          payload: {
            name: 'poolRacks',
            value: Array(2).fill({}),
          },
        });
      } else if (value === '2-kingfisher') {
        componentDispatch({
          type: 'setValue',
          payload: {
            name: 'poolRacks',
            value: Array(4).fill({}),
          },
        });

        form.setFieldsValue({ qntParam: 'duplicate' });

        componentDispatch({
          type: 'setValue',
          payload: {
            name: 'qntParam',
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
        initialValues={{ kfpParam, qntParam }}
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
            <Radio.Button value="1-kingfisher" className={styles.radio}>
              1 KingFisher Plate
            </Radio.Button>
            <Radio.Button value="2-kingfisher" className={styles.radio}>
              2 KingFisher Plate
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="qntParam" rules={[rules.required]}>
          <Radio.Group
            name="qntParam"
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
              disabled={runState.kfpParam === '2-kingfisher'}
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
