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
  const initialState = {
    currentStage: 0,
    // currentStage: 1,
    param1: '1-kingfisher',
    param2: 'duplicate',
    poolRacks: [
      {
        id: '0f6c47ae-c8ca-4b78-bbc0-c2b01582dde0',
        rack_id: '104803200100179',
        scan_timestamp: '2021-02-06T20:36:17-05:00',
      },
      {
        id: '94b95603-e613-4655-8e33-2016a93e9662',
        rack_id: 'ER00030272',
        scan_timestamp: '2021-02-06T19:51:48-05:00',
      },
    ],
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'setValue':
        return {
          ...state,
          [action.payload.name]: action.payload.value,
        };
      default:
        throw new Error();
    }
  };

  const [state, componentDispatch] = useReducer(reducer, initialState);
  // console.log('state', state);

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
          <Stage1
            state={state}
            componentDispatch={componentDispatch}
            initialValues={initialState}
          />
        ),
      },
      {
        title: 'PoolRacks',
        data: [],
        component: (
          <Stage2 state={state} componentDispatch={componentDispatch} />
        ),
      },
      {
        title: 'Download',
        data: [],
        component: <Stage3 />,
      },
    ],
  };

  const handleStageChange = current => {
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
          current={state.currentStage}
          size="small"
          onChange={handleStageChange}
        >
          {/* <Steps current={state.currentStage} onChange={handleStageChange} direction="vertical"> */}
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

      {stages.items[state.currentStage].component}
    </>
  );
};

export default RunCreation;
