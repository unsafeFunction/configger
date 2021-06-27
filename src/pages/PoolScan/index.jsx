import React, { useCallback, useEffect } from 'react';
import { Button, Col, Row, Statistic } from 'antd';
import Rackboard from 'components/widgets/Rackboard';
import PoolStatistic from 'components/widgets/Scans/PoolStatistic';
import moment from 'moment-timezone';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import actions from 'redux/scanSessions/actions';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

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
            <div className={styles.actions}>
              <Button
                data-type="prev"
                disabled={disableNavigationButton('prev') || scan?.isLoading}
                onClick={goToScan}
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
                ? moment(scan.scan_timestamp).format('llll')
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
                ? moment(scan.last_modified_on).format('llll')
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
