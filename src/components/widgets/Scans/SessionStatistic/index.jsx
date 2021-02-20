import React from 'react';
import PropTypes from 'prop-types';
import { Card, Tag, Statistic, Col, Row } from 'antd';
import classNames from 'classnames';
import styles from '../styles.module.scss';

const SessionStatistic = ({ session }) => {
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
            value={session?.scans?.length}
            formatter={value => <Tag color="geekblue">{value}</Tag>}
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
            value={session?.scans?.length}
            formatter={value => <Tag color="geekblue">{value}</Tag>}
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
            value={session?.scans?.length}
            formatter={value => <Tag color="cyan">{value}</Tag>}
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
            value={session?.scans?.length}
            formatter={value => <Tag color="cyan">{value}</Tag>}
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
