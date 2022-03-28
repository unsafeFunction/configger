/* eslint-disable prettier/prettier */
/* eslint-disable indent */
import {
  CloseOutlined,
  DownOutlined,
  EditOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Dropdown,
  Input,
  Menu,
  Popconfirm,
  Row,
  Statistic,
  Tooltip,
  Typography,
  Divider,
} from 'antd';
import classNames from 'classnames';
import InfoButton from 'components/layout/InfoButton';
import PulseCircle from 'components/widgets/Pools/PulseCircle';
import Rackboard from 'components/widgets/Rackboard';
import ScanStatistic from 'components/widgets/Scans/ScanStatistic';
import SessionStatistic from 'components/widgets/Scans/SessionStatistic';
import SessionEntryModal from 'components/widgets/SessionEntryModal';
import SingleSessionTable from 'components/widgets/SingleSessionTable';
import useKeyPress from 'hooks/useKeyPress';
import moment from 'moment-timezone';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import drawerActions from 'redux/drawer/actions';
import modalActions from 'redux/modal/actions';
import actions from 'redux/scanSessions/actions';
import { constants } from 'utils/constants';
import cookieStorage from 'utils/cookie';
import SaveScanModal from './SaveScanModal';
import SaveSessionModal from './SaveSessionModal';
import ScanStatusProgress from './ScanStatusProgress';
import styles from './styles.module.scss';

const { Paragraph } = Typography;
const cookie = cookieStorage();

const Scan = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const modalStatus = cookie.getItem('disableSessionModal');

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

  const [isDiagnostic, setDiagnostic] = useState(true);

  const { started, invalid, completed } = constants.scanStatuses;

  useEffect(() => {
    const scanInWork = scans?.find(
      (s) => s.status === started || s.status === invalid,
    );

    setScansInWork([
      ...(scanInWork ? [scanInWork] : []),
      ...scans
        ?.filter((scan) => scan.status === completed)
        .sort((a, b) => {
          const reA = /[^a-zA-Z]/g;
          const reN = /[^0-9]/g;
          const nameA = a.scan_name.replace(reA, '').toLowerCase();
          const nameB = b.scan_name.replace(reA, '').toLowerCase();
          if (nameA === nameB) {
            const nameANumber = parseInt(a.scan_name.replace(reN, ''), 10);
            const nameBNumber = parseInt(b.scan_name.replace(reN, ''), 10);
            return nameANumber === nameBNumber
              ? 0
              : nameANumber > nameBNumber
              ? 1
              : -1;
          }
          return nameA > nameB ? 1 : -1;
        }),
    ]);
  }, [scans, started, invalid, completed]);

  const handleCloseModal = () => {
    dispatch({
      type: modalActions.HIDE_MODAL,
    });
  };

  useEffect(() => {
    if (modalStatus !== constants.tipsModalStatuses.hide) {
      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'COMPLIANCE_MODAL',
        modalProps: {
          title: 'Session tips',
          bodyStyle: {
            height: '50vh',
            overflow: 'auto',
          },
          cancelButtonProps: {
            className: styles.hiddenButton,
          },
          onOk: handleCloseModal,
          width: '60%',
          message: () => (
            <SessionEntryModal type={session?.session_timeout_in_minutes} />
          ),
        },
      });
    }
  }, [modalStatus]);

  useEffect(() => {
    if (session.scanner_id) {
      dispatch({
        type: actions.CHECK_SCANNER_STATUS_BY_ID_REQUEST,
        payload: { scannerId: session.scanner_id },
      });
    }
  }, [session.scanner_id, dispatch]);

  const scanIndex = scansInWork.findIndex((s) => s.id === scan?.id);

  const getPoolName = useCallback(
    (scan) => {
      if (scan?.isLoading || session?.isLoading || !scan?.scan_name) {
        return '-';
      }
      return scan.scan_name;
    },
    [session],
  );

  const poolName = getPoolName(scan);

  const refPoolsCount = session?.reference_pools_count;
  const refSamplesCount = session?.reference_samples_count;
  const actualPools = scans?.filter((scan) => scan.status === completed);
  const actualPoolsCount = actualPools.length;
  const actualSamplesCount = actualPools.reduce((acc, curr) => {
    return acc + curr.tubes_count;
  }, 0);

  const incorrectPositions = scan?.incorrect_positions?.join(', ');
  const isIncorrectTubes = incorrectPositions?.length > 0;
  const emptyPositions = scan?.empty_positions?.join(', ');
  const isEmptyTubes = emptyPositions?.length > 0;

  const companyInfo = session?.company_short;

  const loadSession = useCallback(() => {
    dispatch({
      type: actions.FETCH_SCAN_SESSION_BY_ID_REQUEST,
      payload: { sessionId },
    });
  }, [dispatch, sessionId]);

  const deleteScan = useCallback(() => {
    dispatch({
      type: actions.VOID_SCAN_BY_ID_REQUEST,
      payload: {
        id: scan?.id,
        reloadSession: loadSession,
      },
    });

    setVisibleActions(false);
  }, [dispatch, scan, loadSession]);

  const updateScan = useCallback(
    (data, id = scan?.id) => {
      setEditOpen(false);
      dispatch({
        type: actions.UPDATE_SCAN_BY_ID_REQUEST,
        payload: {
          data,
          id,
        },
      });
    },
    [dispatch, scan],
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
      callback: () => history.push('/intake-receipt-log'),
    });
  }, [updateSession, sessionId, history]);

  const markCompleteSession = useCallback(() => {
    updateSession({
      data: { status: 'COMPLETED' },
      id: sessionId,
      isSaveSession: true,
      callback: () => history.push('/intake-receipt-log'),
    });
  }, [updateSession, sessionId, history]);

  const scanMenu = (
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

  const handleSwitchVisibleActions = useCallback(() => {
    setVisibleActions(!visibleActions);
  }, [visibleActions]);

  const handleSessionActionVisible = useCallback(() => {
    setSessionActionVisible(!isSessionActionsVisible);
  }, [setSessionActionVisible, isSessionActionsVisible]);

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
          width: 650,
          okText: 'Save session',
          message: () => (
            <SaveSessionModal
              actualPoolsCount={actualPoolsCount}
              actualSamplesCount={actualSamplesCount}
              refPoolsCount={refPoolsCount}
              refSamplesCount={refSamplesCount}
            />
          ),
        },
      });
    },
    [dispatch, markCompleteSession],
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
    </Menu>
  );

  const reverseScanDrawer = useCallback(
    (scanId) => {
      dispatch({
        type: drawerActions.SHOW_DRAWER,
        drawerProps: {
          title: 'Warning',
          placement: 'top',
          maskClosable: false,
          closable: false,
          maskStyle: {
            'background-color': 'rgba(38, 50, 56, 0.2)',
          },
        },
        footerProps: {
          okText: 'Reverse scan',
          onOk: () => {
            updateScan({ reverse: true }, scanId);
          },
        },
        content: () => {
          return (
            <Alert
              showIcon
              type="warning"
              message="Warning"
              description={<Paragraph>IS IT A REVERSED SCAN?</Paragraph>}
            />
          );
        },
      });
    },
    [dispatch, updateScan],
  );

  const loadScan = useCallback(
    (scanId) => {
      dispatch({
        type: actions.FETCH_SCAN_BY_ID_REQUEST,
        payload: {
          scanId,
          callback: () => reverseScanDrawer(scanId),
        },
      });
    },
    [dispatch, reverseScanDrawer],
  );

  useEffect(() => {
    if (scansInWork[0]?.id) {
      loadScan(scansInWork[0]?.id);
    } else {
      dispatch({ type: actions.RESET_SCAN });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, scansInWork[0]?.id]);

  const useFetching = () => {
    useEffect(() => {
      loadSession();
    }, []);
  };

  useFetching();

  useEffect(() => {
    if (session?.activeSessionId === undefined) {
      history.push('/intake-receipt-log');
    }
  }, [session.activeSessionId]);

  useEffect(() => {
    setChangedPoolName(scan?.scan_name);
    setDiagnostic(scan?.is_diagnostic);
  }, [scan]);

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (session.requestStatus) {
        dispatch({
          type: actions.FETCH_ACTIVE_SCANS_REQUEST,
          payload: {
            sessionId,
            existingScans: scans.map((scan) => {
              return scan.pool_id;
            }),
          },
        });
      }
    }, 7000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [
    session.reference_pools_count,
    actualPoolsCount,
    scans,
    dispatch,
    session.requestStatus,
  ]);

  const handleOpenEdit = useCallback(() => {
    setEditOpen(!isEditOpen);
    if (isEditOpen) {
      setChangedPoolName(scan?.scan_name);
    }
  }, [isEditOpen, setEditOpen, scan]);

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
          updateScan({ status: completed, is_diagnostic: isDiagnostic });
        },
        bodyStyle: {
          maxHeight: '70vh',
          overflow: 'scroll',
        },
        width: 650,
        okButtonProps: {
          disabled: isIncorrectTubes,
        },
        okText: 'Save scan',
        message: () => (
          <SaveScanModal
            isIncorrectTubes={isIncorrectTubes}
            isEmptyTubes={isEmptyTubes}
            incorrectPositions={incorrectPositions}
            emptyPositions={emptyPositions}
            isDiagnostic={isDiagnostic}
          />
        ),
      },
    });
  }, [dispatch, updateScan, incorrectPositions, completed, isDiagnostic]);

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
      if (scan?.status !== completed) {
        return onSaveScanModalToggle();
      }
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

  return (
    <div>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <Typography.Title level={4} className="font-weight-normal">
          {scan?.scan_timestamp
            ? `Scan on ${moment(scan.scan_timestamp).format(
                constants.dateTimeFormat,
              )}`
            : ''}
        </Typography.Title>
        <Row>
          <div>
            <Button
              onClick={() => {
                onSaveSessionModalToggle(
                  refPoolsCount,
                  refSamplesCount,
                  actualPoolsCount,
                  actualSamplesCount,
                );
              }}
              type="primary"
              htmlType="submit"
            >
              Save Session
            </Button>
            <InfoButton type="saveSession" />
          </div>
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
            className={styles.actions}
          >
            <Button className="ml-3" type="primary" ghost>
              Session Actions
              <DownOutlined />
            </Button>
          </Dropdown>
          <InfoButton type="cancelSession" />
        </Row>
      </div>
      <Row gutter={[48, 40]} justify="center">
        <Col xs={24} md={18} lg={16} xl={14}>
          <div className="mb-4">
            <div className={styles.navigationWrapper}>
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
                  overlay={scanMenu}
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
                  <Button type="primary" ghost>
                    Scan Actions
                    <DownOutlined />
                  </Button>
                </Dropdown>
                <InfoButton type="scanActions" />
              </div>
              {/*<div>*/}
              {/*  <Progress*/}
              {/*    type="circle"*/}
              {/*    percent={100}*/}
              {/*    width={100}*/}
              {/*    format={_ => <p style={{fontSize: 16, marginBottom: 0}}>Completed</p>}*/}
              {/*  />*/}
              {/*</div>*/}
              <div>
                <Tooltip title="Press Enter to save scan">
                  <Button
                    onClick={onSaveScanModalToggle}
                    type="primary"
                    htmlType="submit"
                    disabled={
                      session?.isLoading ||
                      scans.length === 0 ||
                      scan?.isLoading ||
                      scan?.status === completed
                    }
                  >
                    Save Scan
                  </Button>
                </Tooltip>

                <InfoButton type="saveScan" />
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
          <div className="mb-4">
            <ScanStatistic scan={scan} />
          </div>
        </Col>
        <Col xs={24} md={18} lg={8} xl={10}>
          <div className={styles.companyDetails}>
            <Card>
              {scan?.id && (
                <Row className={styles.scanStatusRow}>
                  <Col>
                    <Statistic
                      className={styles.companyDetailsStat}
                      title={
                        <p className={styles.scanStatusTitle}>Scan status</p>
                      }
                      formatter={() => (
                        <ScanStatusProgress status={scan?.status} />
                      )}
                    />
                  </Col>
                </Row>
              )}
              <div className={styles.companyContainer}>
                <Row>
                  <Col className="mr-4">
                    <Statistic
                      className={styles.companyDetailsStat}
                      title="Company name"
                      value={companyInfo?.name ?? '–'}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="mr-4">
                    <Statistic
                      className={styles.companyDetailsStat}
                      title="Company short"
                      value={companyInfo?.name_short ?? '–'}
                    />
                  </Col>
                  <Col className="mr-4">
                    <Statistic
                      className={styles.companyDetailsStat}
                      title="Company ID"
                      groupSeparator=""
                      value={companyInfo?.company_id ?? '–'}
                    />
                  </Col>
                </Row>
              </div>
              <Row>
                <Col className="mr-4">
                  <div className={styles.statisticReplacement}>
                    <div className={styles.statisticReplacementTitle}>
                      <p>Diagnostic status </p>
                    </div>
                    <div className={styles.statisticReplacementContent}>
                      <span className={styles.statisticReplacementValue}>
                        <Checkbox
                          className="mb-1"
                          disabled={
                            scan?.pool_id?.split?.('-')?.[0] ===
                            constants.scan.emptyPoolId
                          }
                          checked={isDiagnostic}
                          onChange={() => setDiagnostic(!isDiagnostic)}
                        >
                          This scan is diagnostic
                        </Checkbox>
                      </span>
                    </div>
                  </div>
                </Col>
                <Col className="mr-4">
                  <Statistic
                    className={styles.companyDetailsStat}
                    title="Scanner status"
                    formatter={() =>
                      scan?.scannerObj?.id ? (
                        <PulseCircle scanner={scan?.scannerObj} />
                      ) : (
                        '-'
                      )
                    }
                  />
                </Col>
                <Col className="mr-4">
                  <div className={styles.statisticReplacement}>
                    <div className={styles.statisticReplacementTitle}>
                      <p>Pool name </p>
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
                </Col>
              </Row>
            </Card>
          </div>
          <SessionStatistic
            refPools={refPoolsCount}
            refSamples={refSamplesCount}
            actualPools={actualPoolsCount}
            actualSamples={actualSamplesCount}
          />
        </Col>
      </Row>
      <SingleSessionTable
        session={session}
        scansInWork={scansInWork}
        handleCancelScan={handleCancelScan}
        loadScan={loadScan}
      />
    </div>
  );
};

export default Scan;
