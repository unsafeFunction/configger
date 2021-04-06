import { Button, Divider, Form, Steps } from 'antd';
import classNames from 'classnames';
import moment from 'moment-timezone';
import React, { useReducer } from 'react';
import { useSelector } from 'react-redux';
import LayoutStage from './LayoutStage';
import values from './params';
import PoolRacksStage from './PoolRacksStage';
import RunStage from './RunStage';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { Step } = Steps;

const TemplateGeneration = () => {
  const [layoutForm] = Form.useForm();

  const { isLoading } = useSelector((state) => state.templateGeneration);

  const initialRunState = {
    currentStage: 0,
    kfpParam: values.oneKFP,
    replicationParam: values.duplicate,
    poolRacks: Array(2).fill({}),
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

  const stages = {
    items: [
      {
        title: 'Layout',
        component: (
          <LayoutStage
            runState={runState}
            componentDispatch={componentDispatch}
            form={layoutForm}
            initialValues={initialRunState}
          />
        ),
      },
      {
        title: 'PoolRacks',
        component: (
          <PoolRacksStage
            runState={runState}
            componentDispatch={componentDispatch}
          />
        ),
      },
      {
        title: 'Run',
        component: (
          <RunStage runState={runState} componentDispatch={componentDispatch} />
        ),
      },
    ],
  };

  const handleStageChange = (current) => {
    componentDispatch({
      type: 'setValue',
      payload: {
        name: 'currentStage',
        value: current,
      },
    });
  };

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Generate Run</h4>
        <Button
          type="primary"
          onClick={() => {
            componentDispatch({ type: 'reset' });
            layoutForm.resetFields();
          }}
          className="mb-2"
        >
          New Run
        </Button>
      </div>

      <div className={styles.stages}>
        <Steps
          current={runState.currentStage}
          size="small"
          onChange={handleStageChange}
          // direction="vertical"
        >
          {stages.items.map((stage) => (
            <Step title={stage.title} key={stage.title} disabled={isLoading} />
          ))}
        </Steps>
        <Divider />
      </div>

      {stages.items[runState.currentStage].component}
    </>
  );
};

export default TemplateGeneration;
