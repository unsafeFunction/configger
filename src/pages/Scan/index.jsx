/* eslint-disable prettier/prettier */
/* eslint-disable indent */
import {
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
  EditOutlined,
  LeftOutlined,
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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import modalActions from 'redux/modal/actions';
import actions from 'redux/scanSessions/actions';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { Paragraph } = Typography;

const Scan = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [visibleActions, setVisibleActions] = useState(false);
  const [isSessionActionsVisible, setSessionActionVisible] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [changedPoolName, setChangedPoolName] = useState('-');
  const isModalOpen = useSelector((state) => state.modal?.isOpen);
  const enterPress = useKeyPress('Enter');
  const leftArrowRef = useRef(null);
  const rightArrowRef = useRef(null);
  const sessionId = history.location.pathname.split('/')[2];

  const [scansInWork, setScansInWork] = useState([]);

  const session = useSelector((state) => state.scanSessions.singleSession);
  const scans = session?.scans;
  const scan = useSelector((state) => state.scanSessions.scan);

  const { started, invalid, completed } = constants.scanStatuses;

  useEffect(() => {
    const scanInWork = scans?.find(
      (s) => s.status === started || s.status === invalid,
    );

    setScansInWork([
      ...(scanInWork ? [scanInWork] : []),
      ...scans?.filter((scan) => scan.status === completed).reverse(),
    ]);
  }, [scans, started, invalid, completed]);

  const scanIndex = scansInWork.findIndex((s) => s.id === scan?.id);

  const getPoolName = useCallback(() => {
    if (scan?.isLoading || session?.isLoading) {
      return '-';
    }
    if (scan?.scan_name) {
      return scan.scan_name;
    }
    if (!scan?.scan_name) {
      return scan?.ordinal_name;
    }
    return '-';
  }, [scan, session]);

  const poolName = getPoolName();

  const refPoolsCount = session?.reference_pools_count;
  const refSamplesCount = session?.reference_samples_count;
  const actualPools = scans?.filter((scan) => scan.status === completed);
  const actualPoolsCount = actualPools.length;
  const actualSamplesCount = actualPools.reduce((acc, curr) => {
    return acc + curr.tubes_count;
  }, 0);

  const incorrectPositions = scan?.incorrect_positions?.join(', ');
  const isIncorrectTubes = incorrectPositions?.length > 0;
  const emptyPosition = scan?.empty_positions?.join(', ');
  const isEmptyTubes = emptyPosition?.length > 0;

  const companyInfo = session?.company_short;

  const deleteScan = useCallback(() => {
    dispatch({
      type: actions.VOID_SCAN_BY_ID_REQUEST,
      payload: { id: scan?.id },
    });

    setVisibleActions(false);
  }, [dispatch, scan]);

  const updateScan = useCallback(
    (data) => {
      setEditOpen(false);
      dispatch({
        type: actions.UPDATE_SCAN_BY_ID_REQUEST,
        payload: {
          data: { ...data, scan_name: poolName, status: 'COMPLETED' },
          id: scan?.id,
        },
      });
    },
    [dispatch, scan, poolName],
  );

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
      data: { status: 'COMPLETED' },
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
          onConfirm={deleteScan}
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
            refPoolsCount,
            refSamplesCount,
            actualPoolsCount,
            actualSamplesCount,
          )
        }
        key="2"
        icon={<CheckOutlined />}
      >
        Save session
      </Menu.Item>
    </Menu>
  );

  const loadScan = useCallback(
    (scanId) => {
      dispatch({
        type: actions.FETCH_SCAN_BY_ID_REQUEST,
        payload: { scanId },
      });
    },
    [dispatch],
  );

  useEffect(() => {
    if (scansInWork[0]?.id) {
      loadScan(scansInWork[0]?.id);
    } else {
      dispatch({ type: actions.RESET_SCAN });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, loadScan, scansInWork[0]?.id]);

  const loadSession = useCallback(() => {
    dispatch({
      type: actions.FETCH_SCAN_SESSION_BY_ID_REQUEST,
      payload: { sessionId },
    });
  }, [dispatch, sessionId]);

  const useFetching = () => {
    useEffect(() => {
      if (!session?.activeSessionId) {
        dispatch({
          type: actions.FETCH_SESSION_ID_REQUEST,
        });
      }
    }, []);
  };

  useFetching();

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

  useEffect(() => {
    setChangedPoolName(poolName);
  }, [poolName]);

  useEffect(() => {
    const isFetchNew = session.reference_pools_count > actualPoolsCount;

    const refreshInterval = setInterval(() => {
      if (isFetchNew) {
        dispatch({
          type: actions.FETCH_ACTIVE_SCANS_REQUEST,
          payload: scans.map((scan) => {
            return scan.pool_id;
          }),
        });
      }
    }, 7000);

    if (!isFetchNew) {
      clearInterval(refreshInterval);
    }

    return () => {
      clearInterval(refreshInterval);
    };
  }, [session.reference_pools_count, actualPoolsCount, scans, dispatch]);

  const handleSwitchVisibleActions = useCallback(() => {
    setVisibleActions(!visibleActions);
  }, [visibleActions]);

  const handleSessionActionVisible = useCallback(() => {
    setSessionActionVisible(!isSessionActionsVisible);
  }, [setSessionActionVisible]);

  const handleOpenEdit = useCallback(() => {
    setEditOpen(!isEditOpen);
    if (isEditOpen) {
      setChangedPoolName(poolName);
    }
  }, [isEditOpen, setEditOpen, poolName]);

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
        data: { scan_name: changedPoolName },
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
          data: { status: 'STARTED' },
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
      !scan.isLoading &&
      scans.length > 0 &&
      !isModalOpen
    ) {
      if (isEditOpen) {
        return handleSavePoolName();
      }
      return onSaveScanModalToggle();
    }
  }, [
    enterPress,
    onSaveScanModalToggle,
    handleSavePoolName,
    isEditOpen,
    isModalOpen,
    scan.isLoading,
    session?.isLoading,
    scans.length,
  ]);

  const onSaveSessionModalToggle = useCallback(
    (refPoolsCount, refSamplesCount, actualPoolsCount, actualSamplesCount) => {
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
              refPoolsCount === actualPoolsCount &&
              refSamplesCount === actualSamplesCount
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
                    {refPoolsCount !== actualPoolsCount && (
                      <Paragraph>
                        Reference pools ({refPoolsCount}) don't match actual
                        pools ({actualPoolsCount})
                      </Paragraph>
                    )}
                    {refSamplesCount !== actualSamplesCount && (
                      <Paragraph>
                        Reference samples ({refSamplesCount}) don't match actual
                        samples ({actualSamplesCount})
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
                className={styles.saveScanBtn}
                disabled={
                  session?.isLoading || scans.length === 0 || scan?.isLoading
                }
              >
                Save Scan
              </Button>
              <div>
                {scansInWork.length > 1 && (
                  <>
                    <Button
                      className="mr-2"
                      ref={leftArrowRef}
                      icon={<LeftOutlined />}
                      onClick={() => {
                        leftArrowRef.current.blur();
                        setEditOpen(false);
                        return (
                          scansInWork[scanIndex - 1]?.id &&
                          loadScan(scansInWork[scanIndex - 1].id)
                        );
                      }}
                      disabled={
                        session?.isLoading ||
                        scan?.isLoading ||
                        !scansInWork[scanIndex - 1]
                      }
                    />
                    <Button
                      className="mr-2"
                      ref={rightArrowRef}
                      icon={<RightOutlined />}
                      onClick={() => {
                        rightArrowRef.current.blur();
                        setEditOpen(false);
                        return (
                          scansInWork[scanIndex + 1]?.id &&
                          loadScan(scansInWork[scanIndex + 1].id)
                        );
                      }}
                      disabled={
                        session?.isLoading ||
                        scan?.isLoading ||
                        !scansInWork[scanIndex + 1]
                      }
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
                  disabled={
                    session?.isLoading || scan?.isLoading || scans.length === 0
                  }
                >
                  <Button type="primary">
                    Actions
                    <DownOutlined />
                  </Button>
                </Dropdown>
              </div>
            </div>
            {/* TODO: why is using separately scanId */}
            <Rackboard
              rackboard={scan}
              scanId={scan?.id}
              session={session}
              editMode={scan?.status !== completed}
            />
          </div>
          <ScanStatistic scan={scan} />
          <Row>
            <Col sm={24}>
              <SingleSessionTable
                session={session}
                scansInWork={scansInWork}
                handleCancelScan={handleCancelScan}
                loadScan={loadScan}
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
                {!session?.isLoading &&
                  !scan?.isLoading &&
                  scans.length > 0 && (
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
                scansInWork[1]
                  ? `${session?.company_short?.name_short} ${
                      scansInWork[1].scan_name
                    }
                    on ${moment(scansInWork[1].scan_timestamp)?.format('lll')}`
                  : '-'
              }
            />
          </div>
          <SessionStatistic
            refPools={refPoolsCount}
            refSamples={refSamplesCount}
            actualPools={actualPoolsCount}
            actualSamples={actualSamplesCount}
          />
        </Col>
      </Row>
    </>
  );
};

export default Scan;
