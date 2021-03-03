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
  Alert,
} from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  CloseOutlined,
  DownOutlined,
  ReloadOutlined,
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

const { Paragraph } = Typography;

const Scan = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [visibleActions, setVisibleActions] = useState(false);
  const [currentScanOrder, setCurrentScanOrder] = useState(0);

  const sessionId = history.location.pathname.split('/')[2];

  const session = useSelector(state => state.scanSessions?.singleSession);
  const scans = session?.scans;
  const scan = session?.scans?.find(
    scan => scan.scan_order === currentScanOrder,
  );
  const recentScan = scans?.[scan?.scan_order - 1];

  const countOfReferencePools = session?.reference_pools_count;
  const countOfReferenceSamples = session?.reference_samples_count;
  const completedPools = scans?.filter(
    scan => scan.status === constants.scanSessions.scanStatuses.completed,
  );
  const countOfCompletedPools = completedPools.length;
  const completedSamples = completedPools?.map?.(
    scan =>
      scan?.scan_tubes?.filter?.(
        tube => tube.status !== constants.tubeStatuses.blank,
      )?.length,
  );
  const countOfCompletedSamples =
    completedSamples?.length > 0
      ? completedSamples?.reduce((acc, curr) => acc + curr)
      : 0;

  const goToNextScan = useCallback(() => {
    const nextScanOrder = scans?.find(
      scan => scan.scan_order > currentScanOrder && scan.status !== 'VOIDED',
    )?.scan_order;

    if (nextScanOrder) {
      setCurrentScanOrder(nextScanOrder);
      history.push({ search: `?scanOrder=${nextScanOrder}` });
    } else {
      const firstScanOrder = scans.find(scan => scan.status !== 'VOIDED')
        ?.scan_order;
      setCurrentScanOrder(firstScanOrder);
      history.push({ search: `?scanOrder=${firstScanOrder}` });
    }
  }, [history, scans, currentScanOrder]);

  const goToPrevScan = useCallback(() => {
    const reversedScans = scans?.slice?.().reverse?.();
    const prevScanOrder = reversedScans?.find(
      scan => scan.scan_order < currentScanOrder && scan.status !== 'VOIDED',
    )?.scan_order;

    if (prevScanOrder >= 0) {
      setCurrentScanOrder(prevScanOrder);
      history.push({ search: `?scanOrder=${prevScanOrder}` });
    } else {
      const lastScanOrder = reversedScans?.find(
        scan => scan.status !== 'VOIDED',
      )?.scan_order;
      setCurrentScanOrder(lastScanOrder);
      history.push({ search: `?scanOrder=${lastScanOrder}` });
    }
  }, [scans, history, currentScanOrder]);

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

      goToNextScan();
    },
    [dispatch, scan, scansTotal, currentScanOrder],
  );

  const handleVoidScan = useCallback(() => {
    goToNextScan();
    deleteScan({ id: scan.id });

    setVisibleActions(false);
  }, [scan, goToNextScan, deleteScan]);

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

  const loadSession = useCallback(() => {
    dispatch({
      type: actions.FETCH_SCAN_SESSION_BY_ID_REQUEST,
      payload: { sessionId },
    });
  }, [dispatch, sessionId]);

  const useFetching = () => {
    useEffect(() => {
      const { scanOrder = 0 } = qs.parse(history.location.search, {
        ignoreQueryPrefix: true,
      });
      setCurrentScanOrder(+scanOrder);

      if (!session?.activeSessionId) {
        dispatch({
          type: actions.FETCH_SESSION_ID_REQUEST,
        });
      }
    }, []);
  };

  useEffect(() => {
    if (session?.activeSessionId && sessionId) {
      if (session?.activeSessionId === sessionId) {
        loadSession();
      } else if (session?.activeSessionId) {
        history.push(`/session/${session?.activeSessionId}`);
      }
    } else if (session?.activeSessionId === undefined) {
      history.push('/session');
    }
  }, [session.activeSessionId, sessionId]);

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
      callback: () => history.push('/session'),
    });
  }, [updateSession, sessionId, history]);

  const handleSwitchVisibleActions = useCallback(() => {
    setVisibleActions(!visibleActions);
  }, [visibleActions]);

  const handleNavigation = useCallback(
    ({ direction }) => {
      if (direction === 'next') {
        goToNextScan();
      } else {
        goToPrevScan();
      }
    },
    [goToNextScan, goToPrevScan],
  );

  const handleNavigateToScan = useCallback(
    ({ scanOrder }) => {
      history.push({ search: `?scanOrder=${scanOrder}` });
      setCurrentScanOrder(scanOrder);
    },
    [history],
  );

  const handleCancelScan = useCallback(
    scan => {
      dispatch({
        type: actions.CANCEL_SCAN_BY_ID_REQUEST,
        payload: {
          data: {
            status: 'STARTED',
          },
          id: scan?.id,
        },
      });
    },
    [dispatch],
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
        message: () => <span>Are you sure to save scan?</span>,
      },
    });
  }, [dispatch, updateScan]);

  const onSaveSessionModalToggle = useCallback(
    (
      countOfReferencePools,
      countOfReferenceSamples,
      countOfCompletedPools,
      countOfCompletedSamples,
    ) => {
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
          message: () => {
            if (
              countOfReferencePools === countOfCompletedPools &&
              countOfReferenceSamples === countOfCompletedSamples
            ) {
              return <span>Are you sure to save session?</span>;
            } else {
              return (
                <Alert
                  showIcon
                  type="warning"
                  message="Warning"
                  description={
                    <>
                      <Paragraph>Are you sure to save session?</Paragraph>
                      {countOfReferencePools !== countOfCompletedPools && (
                        <Paragraph>
                          Reference pools ({countOfReferencePools}) don't match
                          completed scans ({countOfCompletedPools})
                        </Paragraph>
                      )}
                      {countOfReferenceSamples !== countOfCompletedSamples && (
                        <Paragraph>
                          Reference samples({countOfReferenceSamples}) don't
                          match completed samples({countOfCompletedSamples})
                        </Paragraph>
                      )}
                    </>
                  }
                />
              );
            }
          },
        },
      });
    },
    [dispatch, markCompleteSession],
  );

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <Typography.Title level={4} className="font-weight-normal">
          {`Scan on ${moment(scan?.scan_timestamp)?.format('LLLL') ?? ''}`}
        </Typography.Title>
        <Row>
          <Button
            onClick={loadSession}
            icon={<ReloadOutlined />}
            className="mb-2 mr-2"
            type="primary"
          >
            Refresh
          </Button>
          <Button
            disabled={session?.isLoading || countOfCompletedPools < 1}
            onClick={() =>
              onSaveSessionModalToggle(
                countOfReferencePools,
                countOfReferenceSamples,
                countOfCompletedPools,
                countOfCompletedSamples,
              )
            }
            className="mb-2"
          >
            End Scanning Session
          </Button>
        </Row>
      </div>
      <Row gutter={[48, 40]} justify="center">
        <Col xs={24} md={18} lg={16} xl={14}>
          <div className="mb-4">
            <div className={styles.navigationWrapper}>
              <Button
                onClick={onSaveScanModalToggle}
                type="primary"
                htmlType="submit"
                disabled={session?.isLoading || session.scans.length === 0}
              >
                Save Scan
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
                        })
                      }
                      disabled={session?.isLoading}
                    />
                  </>
                )}
                <Dropdown
                  overlay={menu}
                  overlayClassName={styles.actionsOverlay}
                  trigger="click"
                  onClick={handleSwitchVisibleActions}
                  visible={visibleActions}
                  onVisibleChange={value => {
                    if (!value) {
                      setVisibleActions(false);
                    }
                  }}
                  disabled={session?.isLoading || session.scans.length === 0}
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
                handleCancelScan={handleCancelScan}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={18} lg={8} xl={10}>
          <div className={styles.companyDetails}>
            <Statistic
              className={styles.companyDetailsStat}
              title="Company name:"
              value={companyInfo?.name ?? '–'}
            />
            <Statistic
              className={styles.companyDetailsStat}
              title="Short company name:"
              value={companyInfo?.name_short ?? '–'}
            />
            <Statistic
              className={styles.companyDetailsStat}
              title="Company ID:"
              groupSeparator=""
              value={companyInfo?.company_id ?? '–'}
            />
            <Statistic
              className={styles.companyDetailsStat}
              title="Pool name:"
              value={
                scan?.scan_order >= 0
                  ? `${moment(scan?.scan_timestamp)?.format('dddd')?.[0]}${
                      scan?.scan_order
                  }`
                  : '-'
              }
            />
            <Statistic
              className={styles.companyDetailsStat}
              title="Most Recent Scan:"
              value={
                scan?.scan_order > 0
                  ? `${session?.company_short?.name_short} ${
                      moment(recentScan?.scan_timestamp)?.format('dddd')?.[0]
                  }${recentScan?.scan_order} on ${moment(
                      recentScan?.scan_timestamp,
                  )?.format('lll')}`
                  : '-'
              }
            />
          </div>
          <SessionStatistic session={session} />
        </Col>
      </Row>
    </>
  );
};

export default Scan;
