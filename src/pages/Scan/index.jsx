/* eslint-disable react/jsx-wrap-multilines */
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
  Divider,
  Dropdown,
  Input,
  Menu,
  Popconfirm,
  Row,
  Space,
  Statistic,
  Tooltip,
  Typography,
  Tag,
} from 'antd';
import PulseCircle from 'components/widgets/Pools/PulseCircle';
import Rackboard from 'components/widgets/Rackboard';
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
import { countedPoolTubes } from 'utils/tubesRules';
import SaveScanModal from './SaveScanModal';
import SaveSessionModal from './SaveSessionModal';
import ScanStatusProgress from './ScanStatusProgress';
import styles from './styles.module.scss';

const { Paragraph } = Typography;
const cookie = cookieStorage();

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

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

  const tubesTotal = scan?.scan_tubes?.filter((tube) => {
    return countedPoolTubes.find((t) => t.status === tube.status);
  });

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
      <div className={styles.headline}>
        <Row gutter={[32, 16]}>
          <Col>
            <Statistic
              className={styles.companyDetailsStat}
              title="Company name"
              value={companyInfo?.name ?? '-'}
            />
          </Col>
          <Col>
            <Statistic
              className={styles.companyDetailsStat}
              title="Company short"
              value={companyInfo?.name_short ?? '-'}
            />
          </Col>
          <Col>
            <Statistic
              className={styles.companyDetailsStat}
              title="Company ID"
              groupSeparator=""
              value={companyInfo?.company_id ?? '-'}
            />
          </Col>
          <Col>
            <Statistic
              className={styles.companyDetailsStat}
              title="Scanner status"
              formatter={() =>
                session?.scannerObj?.id ? (
                  <PulseCircle scanner={session?.scannerObj} />
                ) : (
                  '-'
                )
              }
            />
          </Col>
        </Row>
        <div className={styles.sessionBtns}>
          {/* <div> */}
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
            size="large"
          >
            Save Session
          </Button>
          {/* <InfoButton type="saveSession" /> */}
          {/* </div> */}
          {/* <div> */}
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
            <Button className="ml-3" type="primary" ghost size="large">
              Session Actions
              <DownOutlined />
            </Button>
          </Dropdown>
          {/* <InfoButton type="cancelSession" /> */}
          {/* </div> */}
        </div>
      </div>

      <Card>
        <Row gutter={64}>
          <Col xs={12}>
            {/* TODO: why is using separately scanId */}
            <Rackboard
              rackboard={scan}
              scanId={scan?.id}
              session={session}
              editMode={scan?.status !== completed}
            />
          </Col>
          <Col xs={12}>
            <Space size="large">
              <div>
                {scansInWork.length > 1 && (
                  <>
                    <Tooltip title="Previous scan">
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
                    </Tooltip>
                    <Tooltip title="Next scan">
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
                    </Tooltip>
                  </>
                )}
              </div>
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
              {/* </InfoButton type="scanActions" /> */}
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
                {/* <InfoButton type="saveScan" /> */}
              </Tooltip>
            </Space>
            <Divider />
            <Card.Meta
              className={styles.cardMeta}
              avatar={<ScanStatusProgress status={scan?.status} />}
              title={`Scan on ${
                scan?.scan_timestamp
                  ? moment(scan.scan_timestamp).format(constants.dateTimeFormat)
                  : ''
              }`}
              description={
                <Typography.Text type="secondary">
                  <b>Rack ID</b>
                  {scan?.rack_id ?? '-'}
                  <br />
                  <b>Pool ID</b>
                  {scan?.pool_id ?? '-'}
                </Typography.Text>
              }
            />
            <div className="mb-3">
              <Row>
                <Col className="mr-4">
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
                </Col>
                <Col className="mr-4">
                  <Statistic
                    className={styles.companyDetailsStat}
                    title="Total Tubes"
                    value={tubesTotal?.length}
                  />
                </Col>
                <Col className="mr-4">
                  <Statistic
                    className={styles.companyDetailsStat}
                    title="Saved / Reference pools"
                    value={`${actualPoolsCount} / ${refPoolsCount}`}
                    formatter={(value) => <Tag color="gold">{value}</Tag>}
                  />
                </Col>
                <Col className="mr-4">
                  <Statistic
                    className={styles.companyDetailsStat}
                    title="Saved / Reference samples"
                    value={`${actualSamplesCount} / ${refSamplesCount}`}
                    formatter={(value) => <Tag color="gold">{value}</Tag>}
                  />
                </Col>
                <Col>
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
                </Col>
                <Divider />
              </Row>
            </div>
          </Col>
        </Row>
      </Card>

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
