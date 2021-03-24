import React, { useReducer } from 'react';
import { Steps, Divider, Button } from 'antd';
import moment from 'moment-timezone';
import classNames from 'classnames';
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import Stage3 from './Stage3';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { Step } = Steps;

const RunCreation = () => {
  const initialRunState = {
    currentStage: 0,
    // currentStage: 1,
    param1: '1-kingfisher',
    param2: 'duplicate',
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
  console.log('runState', runState);

  const stages = {
    items: [
      {
        title: 'Layout',
        component: (
          <Stage1 runState={runState} componentDispatch={componentDispatch} />
        ),
      },
      {
        title: 'PoolRacks',
        component: (
          <Stage2 runState={runState} componentDispatch={componentDispatch} />
        ),
      },
      {
        title: 'Download',
        component: (
          <Stage3 runState={runState} componentDispatch={componentDispatch} />
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
          onClick={() =>
            componentDispatch({
              type: 'reset',
            })
          }
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
            <Step title={stage.title} key={stage.title} />
          ))}
        </Steps>
        <Divider />
      </div>

      {stages.items[runState.currentStage].component}
    </>
  );
};

export default RunCreation;
