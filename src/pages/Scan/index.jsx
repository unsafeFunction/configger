import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/scanSessions/actions';
import modalActions from 'redux/modal/actions';
import { constants } from 'utils/constants';
import {
  Row,
  Col,
  Button,
  Typography,
  Popconfirm,
  Statistic,
  Dropdown,
  Menu,
} from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  CloseOutlined,
  DownOutlined,
} from '@ant-design/icons';
import Rackboard from 'components/widgets/Rackboard';
import SingleSessionTable from 'components/widgets/SingleSessionTable';
import ScanStatistic from 'components/widgets/Scans/ScanStatistic';
import SessionStatistic from 'components/widgets/Scans/SessionStatistic';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment-timezone';
import qs from 'qs';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const Scan = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [visibleActions, setVisibleActions] = useState(false);
  const [currentScanOrder, setCurrentScanOrder] = useState(0);

  const sessionId = history.location.pathname.split('/')[2];

  const session = useSelector(state => state.scanSessions?.singleSession);
  const scan = session?.scans?.[currentScanOrder];
  const isEndSessionDisabled = session?.scans?.find(
    scan => scan.status === constants.scanSessions.scanStatuses.voided,
  );
  const countOfStartedScans = session?.scans?.find(
    scan => scan.status === constants.scanSessions.scanStatuses.started,
  )?.length;

  const scansTotal = session?.scans?.length;

  const companyInfo = session?.company_short;
  const deleteScan = useCallback(
    data => {
      dispatch({
        type: actions.VOID_SCAN_BY_ID_REQUEST,
        payload: { ...data },
      });
    },
    [dispatch],
  );

  const updateScan = useCallback(
    data => {
      dispatch({
        type: actions.UPDATE_SCAN_BY_ID_REQUEST,
        payload: {
          data,
          id: scan?.id,
        },
      });
    },
    [dispatch, scan],
  );

  const handleVoidScan = useCallback(() => {
    deleteScan({ id: scan.id });

    setVisibleActions(false);
  }, [scan]);

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<CloseOutlined />}>
        <Popconfirm
          title="Are you sure to Void Scan?"
          okText="Yes"
          cancelText="No"
          onConfirm={handleVoidScan}
        >
          Void Scan
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  const useFetching = () => {
    useEffect(() => {
      const { scanOrder = 0 } = qs.parse(history.location.search, {
        ignoreQueryPrefix: true,
      });
      setCurrentScanOrder(+scanOrder);

      dispatch({
        type: actions.FETCH_SCAN_SESSION_BY_ID_REQUEST,
        payload: { sessionId },
      });
    }, []);
  };

  useFetching();

  const updateSession = useCallback(
    data => {
      dispatch({
        type: actions.UPDATE_SESSION_REQUEST,
        payload: { ...data },
      });
    },
    [dispatch],
  );

  const markCompleteSession = useCallback(() => {
    updateSession({
      status: 'COMPLETED',
      id: sessionId,
    });
  }, [updateSession, sessionId]);

  const handleSwitchVisibleActions = useCallback(() => {
    setVisibleActions(!visibleActions);
  }, [visibleActions]);

  const handleNavigation = useCallback(
    ({ direction, total }) => {
      let order = +currentScanOrder;
      if (direction === 'prev') {
        order <= 0 ? (order = total) : order--;
      } else if (direction === 'next') {
        order >= total ? (order = 0) : order++;
      }
      history.push({ search: `?scanOrder=${order}` });
      setCurrentScanOrder(order);
    },
    [currentScanOrder, history],
  );

  const handleNavigateToScan = useCallback(
    ({ scanOrder }) => {
      history.push({ search: `?scanOrder=${scanOrder}` });
      setCurrentScanOrder(scanOrder);
    },
    [currentScanOrder, history],
  );

  const onSaveScanModalToggle = useCallback(() => {
    dispatch({
      type: modalActions.SHOW_MODAL,
      modalType: 'COMPLIANCE_MODAL',
      modalProps: {
        title: 'Save scan',
        onOk: () => updateScan(),
        bodyStyle: {
          maxHeight: '70vh',
          overflow: 'scroll',
        },
        okText: 'Save',
        message: () => <span>Are you cure to save scan?</span>,
      },
    });
  }, [dispatch, scan]);

  const onSaveSessionModalToggle = useCallback(() => {
    dispatch({
      type: modalActions.SHOW_MODAL,
      modalType: 'COMPLIANCE_MODAL',
      modalProps: {
        title: 'Save session',
        onOk: markCompleteSession,
        bodyStyle: {
          maxHeight: '70vh',
          overflow: 'scroll',
        },
        okText: 'Save',
        message: () => <span>Are you sure to save session?</span>,
      },
    });
  }, [dispatch]);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <Typography.Title level={4} className="font-weight-normal">
          {`Scan on ${moment(scan?.scan_timestamp)?.format('LLLL') ?? ''}`}
        </Typography.Title>
        <Button
          disabled={
            isEndSessionDisabled ||
            countOfStartedScans > 1 ||
            session?.isLoading
          }
          onClick={onSaveSessionModalToggle}
          className="mb-2"
        >
          End Scanning Session
        </Button>
      </div>
      <Row gutter={[48, 40]} justify="center">
        <Col xs={24} md={18} lg={16} xl={14}>
          <div className="mb-4">
            <div className={styles.navigationWrapper}>
              <Button
                onClick={onSaveScanModalToggle}
                type="primary"
                htmlType="submit"
                disabled={session?.isLoading}
              >
                Save and Scan Another
              </Button>
              <div>
                {scansTotal > 1 && (
                  <>
                    <Button
                      className="mr-2"
                      icon={<LeftOutlined />}
                      onClick={() =>
                        handleNavigation({
                          direction: 'prev',
                          total: scansTotal - 1,
                        })
                      }
                      disabled={session?.isLoading}
                    />
                    <Button
                      className="mr-2"
                      icon={<RightOutlined />}
                      onClick={() =>
                        handleNavigation({
                          direction: 'next',
                          total: scansTotal - 1,
                        })
                      }
                      disabled={session?.isLoading}
                    />
                  </>
                )}

                <Dropdown
                  overlay={menu}
                  overlayClassName={styles.actionsOverlay}
                  onClick={handleSwitchVisibleActions}
                  visible={visibleActions}
                  disabled={session?.isLoading}
                >
                  <Button type="primary">
                    Actions
                    <DownOutlined />
                  </Button>
                </Dropdown>
              </div>
            </div>
            {/* TODO: why is using separately scanId */}
            <Rackboard rackboard={scan} scanId={scan?.id} session={session} />
          </div>
          <ScanStatistic scan={scan} scansTotal={scansTotal} />
          <Row>
            <Col sm={24}>
              <SingleSessionTable
                session={session}
                handleNavigateToScan={handleNavigateToScan}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={18} lg={8} xl={10}>
          <div className={styles.companyDetails}>
            <Statistic
              className={styles.companyDetailsStat}
              title="Company name:"
              value={companyInfo?.name || '–'}
            />
            <Statistic
              className={styles.companyDetailsStat}
              title="Short company name:"
              value={companyInfo?.name_short || '–'}
            />
            <Statistic
              className={styles.companyDetailsStat}
              title="Company ID:"
              groupSeparator=""
              value={companyInfo?.company_id || '–'}
            />
            <Statistic
              className={styles.companyDetailsStat}
              title="Pool name:"
              value={`${moment(scan?.scan_timestamp)?.format('dddd')?.[0]}${
                scan?.scan_order
              }`}
            />
            <Statistic
              className={styles.companyDetailsStat}
              title="Most Recent Scan:"
              value="Name here"
            />
          </div>
          <SessionStatistic session={session} />
        </Col>
      </Row>
    </>
  );
};

export default Scan;
