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
    height: '500',
    display: 'flex',
    alignItems: 'center',
  };
  return (
    <Carousel adaptiveHeight autoplay autoplaySpeed={4000}>
      <div style={contentStyle}>
        <b className={styles.modalTitle}>Save session</b>
        <img src={saveSession} alt="save-session" />
        <p className={styles.tipDescription}>
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book. It has survived not only five centuries,
          Lorem Ipsum
        </p>
      </div>
      <div style={contentStyle}>
        <b className={styles.modalTitle}>Cancel session</b>
        <img src={cancelSession} alt="cancel-session" />
        <p className={styles.tipDescription}>
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book. It has survived not only five centuries,
          but also the leap into electronic typesetting.
        </p>
      </div>
    </Carousel>
  );
};

export default InfoModal;
