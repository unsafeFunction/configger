import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import poolRackActions from 'redux/racks/actions';
import modalActions from 'redux/modal/actions';
import { Row, Col, Card } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment-timezone';
import { constants } from 'utils/constants';
import PoolRackTable from './PoolRackTable';
import PoolRack from './PoolRack';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const Stage2 = ({ state, componentDispatch }) => {
  const dispatch = useDispatch();
  // const [searchName, setSearchName] = useState('');

  const poolRacks = useSelector(state => state.racks.racks);

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: poolRackActions.FETCH_RACKS_REQUEST,
        payload: {
          limit: constants.poolRacks.itemsLoadingCount,
        },
      });
    }, [dispatch]);
  };

  useFetching();

  const loadMore = useCallback(() => {
    dispatch({
      type: poolRackActions.FETCH_RACKS_REQUEST,
      payload: {
        limit: constants.poolRacks.itemsLoadingCount,
        offset: poolRacks.offset,
      },
    });
  }, [dispatch, poolRacks]);

  const handleModalTable = useCallback(() => {
    dispatch({
      type: modalActions.SHOW_MODAL,
      modalType: 'COMPLIANCE_MODAL',
      modalProps: {
        title: 'Select Pool Rack',
        // onOk: () => resultUpdate({ poolUniqueId, value: option.key }),
        onOk: () => console.log('OK - Modal - Select pool rack'),
        bodyStyle: {
          maxHeight: '70vh',
          overflow: 'scroll',
        },
        okText: 'Continue',
        message: () => <PoolRackTable loadMore={loadMore} />,
        width: '100%',
      },
    });
  }, [dispatch, poolRacks]);

  const handleModalPoolRack = useCallback(
    poolRackId => {
      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'COMPLIANCE_MODAL',
        modalProps: {
          title: 'PoolRack',
          // onOk: () => resultUpdate({ poolUniqueId, value: option.key }),
          onOk: () => console.log('OK - Modal - View Rack'),
          bodyStyle: {
            maxHeight: '70vh',
            overflow: 'scroll',
          },
          // okText: 'Continue',
          message: () => <PoolRack poolRackId={poolRackId} />,
          width: '100%',
        },
      });
      // }, [resultUpdate, dispatch]);
    },
    [dispatch],
  );

  return (
    <>
      <Row gutter={[40, 56]} justify="center">
        {state.poolRacks.map(poolRack => (
          <Col
            xs={24}
            sm={20}
            md={16}
            lg={12}
            xl={10}
            xxl={8}
            key={poolRack.id}
          >
            <Card
              title="Pool Rack 1"
              extra={
                <a className="text-primary" onClick={handleModalTable}>
                  Select Pool Rack
                </a>
              }
              actions={[
                <EyeOutlined
                  key="view"
                  onClick={() => handleModalPoolRack(poolRack.id)}
                />,
                <DeleteOutlined key="delete" />,
              ]}
            >
              <p>Pool Rack ID: {poolRack.rack_id ?? '-'}</p>
              <p>Pool Rack Name: -</p>
              <p>
                Updated Time:{' '}
                {poolRack.scan_timestamp
                  ? moment(poolRack.scan_timestamp).format('lll')
                  : '-'}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Stage2;
