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
  Card,
  Tag,
  Tooltip,
  Dropdown,
  Menu,
} from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  ArrowUpOutlined,
  CloseOutlined,
  DownOutlined,
} from '@ant-design/icons';
import Rackboard from 'components/widgets/Rackboard';
import SingleSessionTable from 'components/widgets/SingleSessionTable';
import SingleScanInfo from 'components/widgets/SingleScanInfo';
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
    scan => scan.status === constants.scanSessions.voided,
  );
  const countOfStartedScans = session?.scans?.find(
    scan => scan.status === constants.scanSessions.started,
  )?.length;

  const companyInfo = session?.company_short;

  const updateScan = useCallback(
    data => {
      dispatch({
        type: actions.UPDATE_SCAN_BY_ID_REQUEST,
        payload: { ...data },
      });
    },
    [dispatch],
  );

  const handleVoidScan = useCallback(() => {
    updateScan({ id: scan.id, status: 'VOIDED' });

    setVisibleActions(false);
  }, []);

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
    }, [dispatch, sessionId]);
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
  }, [dispatch]);

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
    [currentScanOrder],
  );

  const handleNavigateToScan = useCallback(
    ({ scanOrder }) => {
      history.push({ search: `?scanOrder=${scanOrder}` });
      setCurrentScanOrder(scanOrder);
    },
    [currentScanOrder],
  );

  const onSaveScanModalToggle = useCallback(() => {
    dispatch({
      type: modalActions.SHOW_MODAL,
      modalType: 'COMPLIANCE_MODAL',
      modalProps: {
        title: 'Save scan',
        onOk: () => {},
        bodyStyle: {
          maxHeight: '70vh',
          overflow: 'scroll',
        },
        okText: 'Save',
        message: () => <span>Are you cure to save scan?</span>,
      },
    });
  }, [dispatch]);

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
          Scan on
          {moment(scan?.scan_timestamp)?.format('LLLL')}
        </Typography.Title>
        <Button
          disabled={isEndSessionDisabled || countOfStartedScans > 1}
          onClick={onSaveSessionModalToggle}
          className="mb-2"
        >
          End Scanning Session
        </Button>
      </div>
      <Row gutter={[40, 48]}>
        <Col
          xs={24}
          sm={20}
          md={18}
          lg={16}
          xl={14}
          style={{ padding: '30px 20px 24px' }}
        >
          <div className="mb-4">
            <div className={styles.navigationWrapper}>
              <Button
                onClick={onSaveScanModalToggle}
                type="primary"
                htmlType="submit"
              >
                Save and Scan Another
              </Button>
              <div>
                <Button
                  className="mr-2"
                  icon={<LeftOutlined />}
                  onClick={() =>
                    handleNavigation({
                      direction: 'prev',
                      total: session?.scans?.length - 1,
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
                      total: session?.scans?.length - 1,
                    })
                  }
                  disabled={session?.isLoading}
                />
                <Dropdown
                  overlay={menu}
                  overlayClassName={styles.actionsOverlay}
                  onClick={handleSwitchVisibleActions}
                  visible={visibleActions}
                >
                  <Button type="primary">
                    Actions
                    <DownOutlined />
                  </Button>
                </Dropdown>
              </div>
            </div>
            {/* TODO: why is using separately scanId */}
            <Rackboard rackboard={scan} scanId={scan?.id} session={session}/>
          </div>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={6}>
              <Card className={styles.card}>
                <Tooltip placement="bottom" title={scan?.rack_id}>
                  <Statistic
                    title="Rack ID"
                    groupSeparator=""
                    value={scan?.rack_id || '–'}
                    formatter={value => <Tag color="blue">{value}</Tag>}
                    className={classNames(styles.rackStat, styles.ellipsis)}
                  />
                </Tooltip>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={5}>
              <Card className={styles.card}>
                <Statistic
                  title="Pool ID"
                  groupSeparator=""
                  value={scan?.pool_id || '–'}
                  formatter={value => <Tag color="geekblue">{value}</Tag>}
                  className={classNames(styles.rackStat, styles.ellipsis)}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={5}>
              <Card className={styles.card}>
                <Statistic
                  title="Status"
                  value={scan?.status?.toLowerCase()}
                  formatter={value => (
                    <Tag icon={<ArrowUpOutlined />} color="purple">
                      {value}
                    </Tag>
                  )}
                  className={classNames(styles.rackStat, styles.ellipsis)}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={4}>
              <Card className={styles.card}>
                <Statistic
                  title="Tubes"
                  value={scan?.items?.length}
                  formatter={value => <Tag color="cyan">{value}</Tag>}
                  className={classNames(styles.rackStat, styles.ellipsis)}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={4}>
              <Card className={styles.card}>
                <Statistic
                  title="Total Scans"
                  value={session?.scans?.length}
                  formatter={value => <Tag color="gold">{value}</Tag>}
                  className={classNames(styles.rackStat, styles.ellipsis)}
                />
              </Card>
            </Col>
          </Row>
          <Row>
            <Col sm={24}>
              <SingleSessionTable
                session={session}
                handleNavigateToScan={handleNavigateToScan}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={18} xl={8}>
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
          <SingleScanInfo session={session} />
        </Col>
      </Row>
    </>
  );
};

export default Scan;
