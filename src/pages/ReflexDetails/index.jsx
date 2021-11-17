import { Descriptions, Divider, Table, Tag } from 'antd';
import classNames from 'classnames';
import moment from 'moment-timezone';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import actions from 'redux/reflex/actions';
import { constants } from 'utils/constants';
import columns from './components';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const ReflexDetails = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { items: reflexList, isLoading } = useSelector(
    (state) => state.reflex.singleReflex,
  );
  const reflexId = location.pathname.split('/')[2];

  const amountOfDetected = reflexList.filter(
    (item) => item.result === constants.poolResults.detected,
  ).length;
  const amountOfInconclusive = reflexList.filter(
    (item) => item.result === constants.poolResults.inconclusive,
  ).length;
  const amountOfInvalid = reflexList.filter(
    (item) => item.result === constants.poolResults.invalid,
  ).length;
  const amountOfNotDetected = reflexList.filter(
    (item) => item.result === constants.poolResults.notDetected,
  ).length;

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_REFLEX_DETAILS_REQUEST,
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
            <Descriptions title="MIRIPOOL F1" size="small">
              <Descriptions.Item>
                Pool Size: –
                <br />
                Total tubes run: –
                <br />
                Rejected/Invalidated: –
              </Descriptions.Item>
            </Descriptions>
            <Divider orientation="left">Results</Divider>
            <Tag color="red">{`Detected: ${amountOfDetected}`}</Tag>
            <Tag color="orange">{`Inconclusive: ${amountOfInconclusive}`}</Tag>
            <Tag color="default">{`Invalid: ${amountOfInvalid}`}</Tag>
            <Tag color="green">{`Not detected: ${amountOfNotDetected}`}</Tag>
          </div>
        )}
      />
    </>
  );
};

export default ReflexDetails;
