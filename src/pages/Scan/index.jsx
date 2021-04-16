/* eslint-disable prettier/prettier */
/* eslint-disable indent */
import {
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
  EditOutlined,
  LeftOutlined,
  ReloadOutlined,
  RightOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Col,
  Dropdown,
  Input,
  Menu,
  Popconfirm,
  Row,
  Statistic,
  Typography,
} from 'antd';
import classNames from 'classnames';
import Rackboard from 'components/widgets/Rackboard';
import ScanStatistic from 'components/widgets/Scans/ScanStatistic';
import SessionStatistic from 'components/widgets/Scans/SessionStatistic';
import SingleSessionTable from 'components/widgets/SingleSessionTable';
import useKeyPress from 'hooks/useKeyPress';
import moment from 'moment-timezone';
import qs from 'qs';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import modalActions from 'redux/modal/actions';
import actions from 'redux/scanSessions/actions';
import { constants } from 'utils/constants';
import { countedPoolTubes } from 'utils/tubesRules';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { Paragraph } = Typography;

const Scan = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [visibleActions, setVisibleActions] = useState(false);
  const [isSessionActionsVisible, setSessionActionVisible] = useState(false);
  const [currentScanOrder, setCurrentScanOrder] = useState(0);
  const [isEditOpen, setEditOpen] = useState(false);
  const [changedPoolName, setChangedPoolName] = useState('-');
  const isModalOpen = useSelector((state) => state.modal?.isOpen);
  const enterPress = useKeyPress('Enter');
  const leftArrowRef = useRef(null);
  const rightArrowRef = useRef(null);
  const sessionId = history.location.pathname.split('/')[2];

  const session = useSelector((state) => state.scanSessions?.singleSession);
  const scans = session?.scans;
  const scan = session?.scans?.find(
    (scan) => scan.scan_order === currentScanOrder,
  );
  const recentScan = scans?.[scan?.scan_order - 1];

  const poolName = scan?.pool_name
    ? scan.pool_name
    : scan?.scan_order >= 0
    ? `${moment(scan?.scan_timestamp)?.format('dddd')?.[0]}${scan?.scan_order +
        1}`
    : '-';

  const countOfReferencePools = session?.reference_pools_count;
  const countOfReferenceSamples = session?.reference_samples_count;
  const completedPools = scans?.filter(
    (scan) => scan.status === constants.scanStatuses.completed,
  );
  const countOfCompletedPools = completedPools.length;
  const completedSamples = completedPools?.map?.(
    (scan) =>
      scan?.scan_tubes?.filter?.((tube) => {
        return countedPoolTubes.find((t) => t.status === tube.status);
      })?.length,
  );
  const countOfCompletedSamples =
    completedSamples?.length > 0
      ? completedSamples?.reduce((acc, curr) => acc + curr)
      : 0;

  const goToNextScan = useCallback(() => {
    const nextScanOrder = scans?.find(
      (scan) => scan.scan_order > currentScanOrder && scan.status !== 'VOIDED',
    )?.scan_order;

    if (nextScanOrder) {
      setCurrentScanOrder(nextScanOrder);
      history.push({ search: `?scanOrder=${nextScanOrder}` });
    } else {
      const firstScanOrder = scans.find((scan) => scan.status !== 'VOIDED')
        ?.scan_order;
      setCurrentScanOrder(firstScanOrder);
      history.push({ search: `?scanOrder=${firstScanOrder}` });
    }
  }, [history, scans, currentScanOrder]);

  const goToPrevScan = useCallback(() => {
    const reversedScans = scans?.slice?.().reverse?.();
    const prevScanOrder = reversedScans?.find(
      (scan) => scan.scan_order < currentScanOrder && scan.status !== 'VOIDED',
    )?.scan_order;

    if (prevScanOrder >= 0) {
      setCurrentScanOrder(prevScanOrder);
      history.push({ search: `?scanOrder=${prevScanOrder}` });
    } else {
      const lastScanOrder = reversedScans?.find(
        (scan) => scan.status !== 'VOIDED',
      )?.scan_order;
      setCurrentScanOrder(lastScanOrder);
      history.push({ search: `?scanOrder=${lastScanOrder}` });
    }
  }, [scans, history, currentScanOrder]);

  const scansTotal = session?.scans?.length;
  const incorrectPositions = scan?.incorrect_positions?.join(', ');
  const isIncorrectTubes = incorrectPositions?.length > 0;
  const emptyPosition = scan?.empty_positions?.join(', ');
  const isEmptyTubes = emptyPosition?.length > 0;

  const companyInfo = session?.company_short;
  const deleteScan = useCallback(
    (data) => {
      dispatch({
        type: actions.VOID_SCAN_BY_ID_REQUEST,
        payload: { ...data },
      });
    },
    [dispatch],
  );

  const updateScan = useCallback(
    (data) => {
      dispatch({
        type: actions.UPDATE_SCAN_BY_ID_REQUEST,
        payload: {
          data: { ...data, pool_name: poolName },
          id: scan?.id,
          callback: goToNextScan,
        },
      });
    },
    [dispatch, scan, scansTotal, currentScanOrder],
  );

  const handleVoidScan = useCallback(() => {
    goToNextScan();
    deleteScan({ id: scan?.id });

    setVisibleActions(false);
  }, [scan, goToNextScan, deleteScan]);

  const updateSession = useCallback(
    (data) => {
      dispatch({
        type: actions.UPDATE_SESSION_REQUEST,
        payload: { ...data },
      });
    },
    [dispatch],
  );

  const closeSession = useCallback(() => {
    updateSession({
      id: sessionId,
      isSaveSession: false,
      callback: () => history.push('/session'),
    });
  }, [updateSession, sessionId, history]);

  const markCompleteSession = useCallback(() => {
    updateSession({
      status: 'COMPLETED',
      id: sessionId,
      isSaveSession: true,
      callback: () => history.push('/session'),
    });
  }, [updateSession, sessionId, history]);

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

  const sessionMenu = (
    <Menu>
      <Menu.Item key="1" icon={<CloseOutlined />}>
        <Popconfirm
          title="Are you sure to cancel session?"
          okText="Yes"
          cancelText="No"
          onConfirm={closeSession}
        >
          Cancel session
        </Popconfirm>
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          onSaveSessionModalToggle(
            countOfReferencePools,
            countOfReferenceSamples,
            countOfCompletedPools,
            countOfCompletedSamples,
          )
        }
        key="2"
        icon={<CheckOutlined />}
      >
        Save session
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

  useEffect(() => {
    setChangedPoolName(scan?.pool_name);
  }, [scan]);

  const handleSwitchVisibleActions = useCallback(() => {
    setVisibleActions(!visibleActions);
  }, [visibleActions]);

  const handleSessionActionVisible = useCallback(() => {
    setSessionActionVisible(!isSessionActionsVisible);
  }, [setSessionActionVisible]);

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

  const handleOpenEdit = useCallback(() => {
    setEditOpen(!isEditOpen);
    if (isEditOpen) {
      setChangedPoolName(scan?.pool_name ? scan?.pool_name : '-');
    }
  }, [isEditOpen, setEditOpen]);

  const handleChangePoolName = useCallback(
    (e) => {
      setChangedPoolName(e.target.value);
    },
    [setChangedPoolName],
  );

  const handleSavePoolName = useCallback(() => {
    dispatch({
      type: actions.UPDATE_SCAN_BY_ID_REQUEST,
      payload: {
        data: {
          pool_name: changedPoolName,
        },
        id: scan?.id,
      },
    });
    setEditOpen(false);
  }, [dispatch, changedPoolName, scan]);

  const handleCancelScan = useCallback(
    (scan) => {
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
        modalId: 'saveScan',
        onOk: () => {
          return !isIncorrectTubes
            ? updateScan()
            : scan?.possibly_reversed && updateScan({ reverse: true });
        },
        bodyStyle: {
          maxHeight: '70vh',
          overflow: 'scroll',
        },
        okButtonProps: {
          disabled: !scan.possibly_reversed && isIncorrectTubes,
        },
        okText: scan.possibly_reversed ? 'Reverse scan' : 'Save',
        message: () => {
          return isIncorrectTubes || isEmptyTubes ? (
            <Alert
              showIcon
              type="warning"
              message="Warning"
              description={
                scan?.possibly_reversed ? (
                  <Paragraph>IS IT A REVERSED SCAN?</Paragraph>
                ) : isIncorrectTubes ? (
                  <Paragraph>{`IT IS IMPOSSIBLE TO SAVE SCAN BECAUSE (${incorrectPositions}) POSITIONS ARE INCORRECT!`}</Paragraph>
                ) : isEmptyTubes ? (
                  <Paragraph>{`ARE YOU SURE THE RED (${emptyPosition}) POSITIONS ARE EMPTY?`}</Paragraph>
                ) : null
              }
            />
          ) : (
            <Paragraph>Are you sure to save scan?</Paragraph>
          );
        },
      },
    });
  }, [dispatch, updateScan, incorrectPositions]);

  useEffect(() => {
    if (
      enterPress &&
      !session?.isLoading &&
      session.scans.length > 0 &&
      !isModalOpen
    ) {
      if (isEditOpen) {
        return handleSavePoolName();
      }
      return onSaveScanModalToggle();
    }
  }, [enterPress, onSaveScanModalToggle]);

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
            }
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
                        Reference samples(
                        {countOfReferenceSamples}) don't match completed
                        samples(
                        {countOfCompletedSamples})
                      </Paragraph>
                    )}
                  </>
                }
              />
            );
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
          <Dropdown
            overlay={sessionMenu}
            overlayClassName={styles.actionsOverlay}
            trigger="click"
            onClick={handleSessionActionVisible}
            visible={isSessionActionsVisible}
            onVisibleChange={(value) => {
              if (!value) {
                setSessionActionVisible(false);
              }
            }}
            disabled={session?.isLoading}
          >
            <Button type="primary">
              Session Actions
              <DownOutlined />
            </Button>
          </Dropdown>
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
                      ref={leftArrowRef}
                      icon={<LeftOutlined />}
                      onClick={() => {
                        leftArrowRef.current.blur();
                        return handleNavigation({
                          direction: 'prev',
                        });
                      }}
                      disabled={session?.isLoading}
                    />
                    <Button
                      className="mr-2"
                      ref={rightArrowRef}
                      icon={<RightOutlined />}
                      onClick={() => {
                        rightArrowRef.current.blur();
                        return handleNavigation({
                          direction: 'next',
                        });
                      }}
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
                  onVisibleChange={(value) => {
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
          <ScanStatistic scan={scan} />
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
              title="Company short:"
              value={companyInfo?.name_short ?? '–'}
            />
            <Statistic
              className={styles.companyDetailsStat}
              title="Company ID:"
              groupSeparator=""
              value={companyInfo?.company_id ?? '–'}
            />
            <div className={styles.statisticReplacement}>
              <div className={styles.statisticReplacementTitle}>
                <p>Pool name: </p>
                {!session?.isLoading && scan && (
                  <EditOutlined
                    onClick={handleOpenEdit}
                    className={styles.editPoolName}
                  />
                )}
              </div>
              <div className={styles.statisticReplacementContent}>
                <span className={styles.statisticReplacementValue}>
                  {isEditOpen ? (
                    <div className={styles.editPoolNameInputWrapper}>
                      <Input
                        onChange={handleChangePoolName}
                        value={changedPoolName}
                        placeholder="Enter new pool name"
                      />
                      <Button type="primary" onClick={handleSavePoolName}>
                        Save
                      </Button>
                    </div>
                  ) : (
                    poolName
                  )}
                </span>
              </div>
            </div>
            <Statistic
              className={styles.companyDetailsStat}
              title="Most Recent Scan:"
              value={
                scan?.scan_order > 0
                  ? `${session?.company_short?.name_short} ${
                      moment(recentScan?.scan_timestamp)?.format('dddd')?.[0]
                    }${recentScan?.scan_order + 1} on ${moment(
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
