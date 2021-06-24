import { Button, Col, Row, Statistic } from 'antd';
import Rackboard from 'components/widgets/Rackboard';
import PoolStatistic from 'components/widgets/Scans/PoolStatistic';
import moment from 'moment-timezone';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import actions from 'redux/scanSessions/actions';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const PoolScan = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const sessionId = pathname.split('/')[2];
  const scanId = pathname.split('/')[3];

  const session = useSelector((state) => state.scanSessions.singleSession);
  const scan = useSelector((state) => state.scanSessions.scan);

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

  const goToScan = useCallback(
    ({ side }) => {
      return console.log(side, 'here');
    },
    [scan],
  );

  const disableNextBtn = useCallback(() => {
    return scan?.id === session?.scans?.[session?.scans.length]?.id;
  }, [scan, session]);

  const disablePrevBtn = useCallback(() => {
    return scan?.id === session?.scans?.[0]?.id;
  }, [scan, session]);

  const poolName = getPoolName();

  const companyInfo = session?.company_short;

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
                disabled={disablePrevBtn()}
                onClick={() => goToScan({ side: 'prev' })}
              >
                Previous
              </Button>
              <Button
                disabled={disableNextBtn()}
                onClick={() => goToScan({ side: 'next' })}
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
