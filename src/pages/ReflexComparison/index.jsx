/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable camelcase */
import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Descriptions, Divider, Table, Tag, Typography } from 'antd';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import actions from 'redux/reflex/actions';
import { constants } from 'utils/constants';
import columns from './components';
import styles from './styles.module.scss';

const ReflexComparison = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    items: reflexList,
    isLoading,
    company_short,
    pool_size,
    pool_name,
  } = useSelector((state) => state.reflex.singleReflex);
  const reflexId = location.pathname.split('/')[2];

  const { poolResults, tubeTypes } = constants;

  const numberOfSamples = (result) => {
    const samples = reflexList.filter((sample) =>
      result
        ? sample.result === poolResults[result] &&
          sample.tube_type === tubeTypes.individual
        : sample.tube_type === tubeTypes.individual,
    );
    return samples.length;
  };

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_REFLEX_COMPARISON_REQUEST,
        payload: {
          id: reflexId,
        },
      });
    }, []);
  };

  useFetching();

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Reflex Comparison</h4>
      </div>
      <Table
        columns={columns}
        dataSource={reflexList}
        scroll={{ x: 1000 }}
        loading={isLoading}
        pagination={false}
        rowKey={(record) => record.tube_id}
        title={() => (
          <div className={styles.tableHeader}>
            <Descriptions
              title={`${company_short} ${pool_name}`}
              size="small"
              column={1}
            >
              <Descriptions.Item>
                Pool Size: {pool_size}
                {numberOfSamples() > 0 && numberOfSamples() !== pool_size && (
                  <Typography.Text type="secondary" italic>
                    <ExclamationCircleTwoTone
                      twoToneColor="orange"
                      className={styles.warning}
                    />
                    pool size isn`t coinciding with the number of individual
                    samples
                  </Typography.Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item>
                Rejected/Invalidated:{' '}
                {numberOfSamples('rejected') + numberOfSamples('invalid')}
              </Descriptions.Item>
            </Descriptions>
            <Divider orientation="left">Results</Divider>
            <Tag color="red">Detected: {numberOfSamples('detected')}</Tag>
            <Tag color="orange">
              Inconclusive: {numberOfSamples('inconclusive')}
            </Tag>
            <Tag color="default">Invalid: {numberOfSamples('invalid')}</Tag>
            <Tag color="green">
              Not detected: {numberOfSamples('notDetected')}
            </Tag>
            <Tag color="default">Rejected: {numberOfSamples('rejected')}</Tag>
          </div>
        )}
      />
    </>
  );
};

export default ReflexComparison;
