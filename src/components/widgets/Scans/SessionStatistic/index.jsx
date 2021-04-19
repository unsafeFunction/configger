import { Card, Col, Row, Statistic, Tag } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { constants } from 'utils/constants';
import { countedPoolTubes } from 'utils/tubesRules';
import styles from '../styles.module.scss';

const SessionStatistic = ({ session }) => {
  const actualPools = session?.scans?.filter(
    (scan) => scan.status === constants.scanStatuses.completed,
  );

  const countOfActualPools = actualPools.length;

  const actualSamples = actualPools?.map?.(
    (scan) =>
      scan?.scan_tubes?.filter?.((tube) => {
        return countedPoolTubes.find((t) => t.status === tube.status);
      })?.length,
  );

  return (
    <Row gutter={[24, 16]}>
      <Col
        xs={{ span: 12, order: 1 }}
        lg={{ span: 24, order: 1 }}
        xl={{ span: 12, order: 1 }}
        xxl={{ span: 9, order: 1 }}
      >
        <Card className={styles.card}>
          <Statistic
            title="Reference pools"
            value={session?.reference_pools_count ?? '-'}
            formatter={(value) => <Tag color="geekblue">{value}</Tag>}
            className={classNames(styles.statistic, styles.ellipsis)}
          />
        </Card>
      </Col>
      <Col
        xs={{ span: 12, order: 3 }}
        lg={{ span: 24, order: 2 }}
        xl={{ span: 12, order: 3 }}
        xxl={{ span: 9, order: 3 }}
      >
        <Card className={styles.card}>
          <Statistic
            title="Actual pools"
            value={countOfActualPools}
            formatter={(value) => <Tag color="geekblue">{value}</Tag>}
            className={classNames(styles.statistic, styles.ellipsis)}
          />
        </Card>
      </Col>
      <Col
        xs={{ span: 12, order: 2 }}
        lg={{ span: 24, order: 3 }}
        xl={{ span: 12, order: 2 }}
        xxl={{ span: 9, order: 2 }}
      >
        <Card className={styles.card}>
          <Statistic
            title="Reference samples"
            value={session?.reference_samples_count ?? '-'}
            formatter={(value) => <Tag color="cyan">{value}</Tag>}
            className={classNames(styles.statistic, styles.ellipsis)}
          />
        </Card>
      </Col>
      <Col
        xs={{ span: 12, order: 4 }}
        lg={{ span: 24, order: 4 }}
        xl={{ span: 12, order: 4 }}
        xxl={{ span: 9, order: 4 }}
      >
        <Card className={styles.card}>
          <Statistic
            title="Actual samples"
            value={
              actualSamples?.length > 0
                ? actualSamples.reduce((acc, curr) => acc + curr)
                : 0
            }
            formatter={(value) => <Tag color="cyan">{value}</Tag>}
            className={classNames(styles.statistic, styles.ellipsis)}
          />
        </Card>
      </Col>
    </Row>
  );
};

SessionStatistic.propTypes = {
  session: PropTypes.shape({}).isRequired,
};

export default SessionStatistic;
