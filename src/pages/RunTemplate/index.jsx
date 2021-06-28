import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Form, Menu, Steps } from 'antd';
import classNames from 'classnames';
import moment from 'moment-timezone';
import React, { useReducer } from 'react';
import { values } from './params';
import ReviewStep from './ReviewStep';
import RunStep from './RunStep';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { Step } = Steps;

const RunTemplate = () => {
  const [form] = Form.useForm();

  const initialRunState = {
    currentStep: 0,
    kfpParam: values.oneKFP,
    replicationParam: values.duplicate,
    poolRacks: [],
  };

  const reducer = (runState, action) => {
    switch (action.type) {
      case 'setValue':
        return {
          ...runState,
          [action.payload.name]: action.payload.value,
        };
      case 'reset':
        return {
          ...runState,
          ...initialRunState,
        };
      default:
        throw new Error();
    }
  };

  const [runState, componentDispatch] = useReducer(reducer, initialRunState);
  console.log('RUN STATE', runState);

  const steps = [
    {
      title: 'Run',
      component: (
        <RunStep
          runState={runState}
          componentDispatch={componentDispatch}
          initialValues={initialRunState}
          form={form}
        />
      ),
    },
    {
      title: 'Review',
      component: (
        <ReviewStep
          runState={runState}
          componentDispatch={componentDispatch}
          form={form}
        />
      ),
    },
  ];

  const runMenu = (
    <Menu>
      <Menu.Item
        key="1"
        icon={<CloseOutlined />}
        onClick={() => {
          componentDispatch({ type: 'reset' });
          form.resetFields();
        }}
      >
        Reset Run
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Generate Run</h4>
        <Dropdown overlay={runMenu} overlayClassName={styles.actionsOverlay}>
          <Button type="primary">
            Run Actions
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>
      <div className={styles.stages}>
        <Steps current={runState.currentStep}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <Divider />
      </div>

      {steps[runState.currentStep].component}
    </>
  );
};

export default RunTemplate;
