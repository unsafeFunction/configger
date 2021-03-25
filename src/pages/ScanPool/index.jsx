import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/scanSessions/actions';
import { Row, Col, Statistic } from 'antd';
import Rackboard from 'components/widgets/Rackboard';
import PoolStatistic from 'components/widgets/Scans/PoolStatistic';
import { useHistory } from 'react-router-dom';
import moment from 'moment-timezone';
import qs from 'qs';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const Pool = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [currentScanOrder, setCurrentScanOrder] = useState(0);

  const sessionId = history.location.pathname.split('/')[2];

  const session = useSelector((state) => state.scanSessions?.singleSession);
  const scan = session?.scans?.find(
    (scan) => scan.scan_order === currentScanOrder,
  );

  const companyInfo = session?.company_short;

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
              value={
                scan?.scan_order >= 0
                  ? `${
                      moment(scan?.scan_timestamp)?.format('dddd')?.[0]
                    }${scan?.scan_order + 1}`
                  : '-'
              }
            />
          </div>
        </Col>
        <Col xs={24} md={18} lg={24}>
          <Statistic
            className={styles.scanStat}
            title="Scanned on:"
            value={moment(scan?.scan_timestamp).format('llll') ?? '–'}
          />
          <Statistic
            className={styles.scanStat}
            title="Scanned by:"
            value={scan?.scanner ?? '–'}
          />
          <Statistic
            className={styles.scanStat}
            title="Last modified on:"
            value={moment(scan?.modified).format('llll') ?? '–'}
          />
          <Statistic
            className={styles.scanStat}
            title="Last modified by:"
            value={moment(scan?.modified).format('llll') ?? '–'}
          />
        </Col>
      </Row>
    </>
  );
};

export default Pool;
