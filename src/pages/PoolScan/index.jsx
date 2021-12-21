import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Menu, Popconfirm, Row, Statistic } from 'antd';
import classNames from 'classnames';
import Rackboard from 'components/widgets/Rackboard';
import PoolStatistic from 'components/widgets/Scans/PoolStatistic';
import moment from 'moment-timezone';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import actions from 'redux/scanSessions/actions';
import styles from './styles.module.scss';

const PoolScan = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const history = useHistory();

  const sessionId = pathname.split('/')[2];
  const scanId = pathname.split('/')[3];

  const session = useSelector((state) => state.scanSessions.singleSession);
  const scan = useSelector((state) => state.scanSessions.scan);

  const companyInfo = session?.company_short;

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

  const goToScan = useCallback(
    (event) => {
      const { type } = event.currentTarget.dataset;
      const currentScanIndex = session.scans.findIndex(
        (sessionScan) => sessionScan.id === scan?.id,
      );

      switch (type) {
        case 'next': {
          if (session.scans[currentScanIndex + 1]) {
            return history.push(`${session.scans[currentScanIndex + 1].id}`);
          }

          return undefined;
        }
        case 'prev': {
          if (session.scans[currentScanIndex - 1]) {
            return history.push(`${session.scans[currentScanIndex - 1].id}`);
          }

          return undefined;
        }
        default:
          return null;
      }
    },
    [scan, session, history],
  );

  const disableNavigationButton = useCallback(
    (type) => {
      if (type === 'prev') {
        return scan?.id === session?.scans?.[0]?.id;
      }
      return scan?.id === session?.scans?.[session?.scans.length]?.id;
    },
    [scan, session],
  );

  const handleDelete = useCallback(() => {
    dispatch({
      type: actions.DELETE_SCAN_BY_ID_REQUEST,
      payload: { id: scan?.id },
    });
    history.push('/pool-scans');
  }, [dispatch, scan, history]);

  const scanMenu = (
    <Menu>
      <Menu.Item key="1" icon={<CloseOutlined />}>
        <Popconfirm
          title="Are you sure to delete Scan?"
          okText="Yes"
          cancelText="No"
          onConfirm={handleDelete}
        >
          Delete scan
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  const useFetching = () => {
    useEffect(() => {
      // TODO: in some cases this request is unnecessary
      dispatch({
        type: actions.FETCH_SCAN_SESSION_BY_ID_REQUEST,
        payload: { sessionId },
      });

      dispatch({
        type: actions.FETCH_SCAN_BY_ID_REQUEST,
        payload: { scanId },
      });
    }, []);
  };

  useFetching();

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Pool scan</h4>
        <Dropdown overlay={scanMenu} overlayClassName={styles.actionsOverlay}>
          <Button type="primary">
            Scan Actions
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>
      <Row gutter={[48, 40]} justify="center">
        <Col xs={24} md={18} lg={16} xl={14}>
          <div className="mb-4">
            {/* TODO: why is using separately scanId */}
            <Rackboard rackboard={scan} scanId={scan?.id} session={session} />
          </div>
          <PoolStatistic scan={scan} />
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
              value={poolName}
            />
            <div>
              <Button
                data-type="prev"
                disabled={disableNavigationButton('prev') || scan?.isLoading}
                onClick={goToScan}
                className="mr-3"
              >
                Previous
              </Button>
              <Button
                data-type="next"
                disabled={disableNavigationButton('next') || scan?.isLoading}
                onClick={goToScan}
                type="primary"
              >
                Next
              </Button>
            </div>
          </div>
        </Col>
        <Col xs={24} md={18} lg={24}>
          <Statistic
            className={styles.scanStat}
            title="Scanned on:"
            value={
              scan?.scan_timestamp
                ? moment(scan.scan_timestamp).format('lll')
                : '–'
            }
          />
          <Statistic
            className={styles.scanStat}
            title="Scanned by:"
            value={session?.scanned_by ?? '–'}
          />
          <Statistic
            className={styles.scanStat}
            title="Last modified on:"
            value={
              scan?.last_modified_on
                ? moment(scan.last_modified_on).format('lll')
                : '–'
            }
          />
          <Statistic
            className={styles.scanStat}
            title="Last modified by:"
            value={scan?.last_modified_by ?? '-'}
          />
        </Col>
      </Row>
    </>
  );
};

export default PoolScan;
