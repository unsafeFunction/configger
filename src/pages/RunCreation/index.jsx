import React, { useReducer } from 'react';
import { Steps, Divider } from 'antd';
import moment from 'moment-timezone';
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
    poolRacks: Array(4).fill({}),
  };

  const reducer = (runState, action) => {
    switch (action.type) {
      case 'setValue':
        return {
          ...runState,
          [action.payload.name]: action.payload.value,
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
        data: [
          // {
          //   title: 'Company',
          //   value: 'Some Name',
          // },
          // {
          //   title: 'Company ID',
          //   value: '123456789',
          //   id: 'text',
          // },
          // {
          //   title: 'Scan Date & Time',
          //   value: 2020-12-12,
          //   id: 'company_date',
          // }
        ],
        component: (
          <Stage1 runState={runState} componentDispatch={componentDispatch} />
        ),
      },
      {
        title: 'PoolRacks',
        data: [],
        component: (
          <Stage2 runState={runState} componentDispatch={componentDispatch} />
        ),
      },
      {
        title: 'Download',
        data: [],
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
      <div className="air__utils__heading">
        <h4>Generate Run</h4>
      </div>

      <div className={styles.stages}>
        <Steps
          current={runState.currentStage}
          size="small"
          onChange={handleStageChange}
          // direction="vertical"
        >
          {stages.items.map((stage, stageIdx) => (
            <Step
              title={stage.title}
              key={stage.title}
              // description={(
              //   <div>
              //     {step.data.map((info) => (
              //       <p>
              //       {info.title}<span className={`ml-3 ${stepIdx !== searchMock.current ? 'text-muted' : 'text-primary' }`}>
              //         {info.id === 'company_date' ? moment(info.value).format('YYYY-MM-DD') : info.value}
              //       </span>
              //       </p>
              //     ))}
              //   </div>
              // )}
            />
          ))}
        </Steps>
        <Divider />
      </div>

      {stages.items[runState.currentStage].component}
    </>
  );
};

export default RunCreation;
