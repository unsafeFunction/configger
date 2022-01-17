import React from 'react';
import { Carousel } from 'antd';
import saveSession from './save-session.gif';
import cancelSession from './cancel-session.gif';
import styles from './styles.module.scss';

const InfoModal = () => {
  const contentStyle = {
    color: '#fff',
    textAlign: 'center',
    background: '#364d79',
  };
  return (
    <Carousel arrows autoplay autoplaySpeed={4500}>
      <div style={contentStyle}>
        <b className={styles.modalTitle}>Save session</b>
        <p className={styles.tipDescription}>
          The save session action set COMPLETE status to all scans
        </p>
        <img src={saveSession} alt="save-session" />
      </div>
      <div style={contentStyle}>
        <b className={styles.modalTitle}>Cancel session</b>
        <p className={styles.tipDescription}>
          The cancel session action set COMPLETE status to all scans
        </p>
        <img src={cancelSession} alt="cancel-session" />
      </div>
    </Carousel>
  );
};

export default InfoModal;
