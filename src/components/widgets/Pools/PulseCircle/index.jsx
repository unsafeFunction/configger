/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const PulseCircle = ({ scanner }) => {
  const onlineStatus = scanner?.is_online;
  return (
    <div className={styles.circleWrapper}>
      <div
        className={`${styles.pulsatingCircle} ${
          !onlineStatus ? styles.offlineStatus : ''
        }`}
      />
      <p>
        Model: {scanner.model} {onlineStatus ? 'Online' : 'Offline'}
      </p>
    </div>
  );
};

PulseCircle.propTypes = {
  scanner: PropTypes.object.isRequired,
};

export default PulseCircle;
