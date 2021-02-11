import React from 'react';
import PropTypes from 'prop-types';
import { Card, Tag, Statistic, Col, Row } from 'antd';
import classNames from 'classnames';
import styles from './styles.module.scss';

const SingleScanInfo = ({ session }) => {
  return (
    <Row>
      <Col xs={12}>
        <Card className={styles.scannedInfoCard}>
          <Statistic
            title="Reference pool"
            value={session?.scans?.length}
            formatter={value => (
              <Tag className={styles.scannedInfoTag} color="geekblue">
                {value}
              </Tag>
            )}
            className={classNames(styles.rackStat, styles.ellipsis)}
          />
        </Card>
        <Card className={styles.scannedInfoCard}>
          <Statistic
            title="Actual pool"
            value={session?.scans?.length}
            formatter={value => (
              <Tag className={styles.scannedInfoTag} color="geekblue">
                {value}
              </Tag>
            )}
            className={classNames(styles.rackStat, styles.ellipsis)}
          />
        </Card>
      </Col>
      <Col xs={12}>
        <Card className={styles.scannedInfoCard}>
          <Statistic
            title="Reference samples"
            value={session?.scans?.length}
            formatter={value => (
              <Tag className={styles.scannedInfoTag} color="cyan">
                {value}
              </Tag>
            )}
            className={classNames(styles.rackStat, styles.ellipsis)}
          />
        </Card>
        <Card className={styles.scannedInfoCard}>
          <Statistic
            title="Actual samples"
            value={session?.scans?.length}
            formatter={value => (
              <Tag className={styles.scannedInfoTag} color="cyan">
                {value}
              </Tag>
            )}
            className={classNames(styles.rackStat, styles.ellipsis)}
          />
        </Card>
      </Col>
    </Row>
  );
};

SingleScanInfo.propTypes = {
  session: PropTypes.shape({}).isRequired,
};

export default SingleScanInfo;
