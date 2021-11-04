/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/intakeLims/actions';
import { Table } from 'antd';
import moment from 'moment-timezone';
import { constants } from 'utils/constants';
import TableFooter from 'components/layout/TableFooterLoader';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const IntakeList = () => {
  const dispatch = useDispatch();

  const intakeList = useSelector((state) => state.intakeLims);

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_INTAKE_REQUEST,
        payload: {
          limit: constants?.runs?.itemsLoadingCount,
        },
      });
    }, [dispatch]);
  };

  useFetching();

  const columns = [
    {
      title: 'Date',
      dataIndex: 'ship_date',
      width: 100,
    },
    {
      title: 'Company name',
      dataIndex: 'company_name',
      width: 100,
    },
    {
      title: 'Ship By',
      dataIndex: 'shipping_by',
      width: 100,
    },
    {
      title: 'Company ID',
      dataIndex: 'company_id',
      width: 50,
    },
    {
      title: 'Pools',
      dataIndex: 'pool_count',
      width: 50,
    },
    {
      title: 'Samples',
      dataIndex: 'sample_count',
      width: 50,
    },
  ];

  const data = intakeList?.items?.map?.((intakeItem) => ({
    ...intakeItem,
    key: intakeItem.company_id,
  }));

  const loadMore = useCallback(() => {
    dispatch({
      type: actions.FETCH_INTAKE_REQUEST,
      payload: {
        limit: constants?.runs?.itemsLoadingCount,
        offset: intakeList.offset,
      },
    });
  }, [dispatch, intakeList]);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Intake</h4>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: 1000 }}
        loading={intakeList.isLoading}
      />
      <TableFooter
        loading={intakeList.isLoading}
        disabled={intakeList.items.length >= intakeList.total}
        loadMore={loadMore}
      />
    </>
  );
};

export default IntakeList;
