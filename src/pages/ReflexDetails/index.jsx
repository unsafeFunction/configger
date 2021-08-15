import { Table } from 'antd';
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
        bordered
      />
    </>
  );
};

export default ReflexDetails;
