/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const PulseCircle = ({ scanner }) => {
  const onlineStatus = scanner?.is_online;
  return (
    <div className={styles.circleWrapper}>
      <p className={styles.statusWrapper}>
        {scanner.model}{' '}
        <span className={onlineStatus ? styles.online : styles.offline}>
          {onlineStatus ? 'Online' : 'Offline'}
        </span>
      </p>
      <div
        className={`${styles.pulsatingCircle} ${
          !onlineStatus ? styles.offlineStatus : ''
        }`}
      />
    </div>
  );
};

PulseCircle.propTypes = {
  scanner: PropTypes.object.isRequired,
};

export default PulseCircle;
