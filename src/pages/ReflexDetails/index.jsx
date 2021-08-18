import { Descriptions, Table, Divider, Tag } from 'antd';
import classNames from 'classnames';
import moment from 'moment-timezone';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import actions from 'redux/reflex/actions';
import columns from './components';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const ReflexDetails = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const reflex = useSelector((state) => state.reflex.singleReflex);

  const sampleId = location.pathname.split('/')[2];

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_REFLEX_DETAILS_REQUEST,
        payload: {
          id: sampleId,
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
        className="mb-5"
        pagination={false}
        columns={columns}
        dataSource={reflex.items}
        scroll={{ x: 1000 }}
        title={() => (
          <div className={styles.tableHeader}>
            <Descriptions title="MIRIPOOL F1" size="small">
              <Descriptions.Item>
                Pool Size: 5
                <br />
                Total tubes run: 4
                <br />
                Rejected/Invalidated: 1
              </Descriptions.Item>
            </Descriptions>
            <Divider orientation="left">Results</Divider>
            <Tag color="red">Detected: 1</Tag>
            <Tag color="orange">Inconclusive: 0</Tag>
            <Tag color="default">Invalid: 0</Tag>
            <Tag color="green">Not detected: 3</Tag>
          </div>
        )}
        bordered
      />
    </>
  );
};

export default ReflexDetails;
