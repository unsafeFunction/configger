import React from 'react';
import { Carousel } from 'antd';
import styles from './styles.module.scss';

const useTip = (type) => {
  switch (type) {
    case 'sessionActions': {
      return (
        <>
          <div>
            <b className={styles.modalTitle}>Save session</b>
            <img
              src="https://qa.media.lims.mirimus.com/save-session.gif"
              alt="save-session"
            />
            <p className={styles.tipDescription}>
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has survived not
              only five centuries, Lorem Ipsum
            </p>
          </div>
          <div>
            <b className={styles.modalTitle}>Cancel session</b>
            <img
              src="https://qa.media.lims.mirimus.com/close-session.gif"
              alt="cancel-session"
            />
            <p className={styles.tipDescription}>
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has survived not
              only five centuries, but also the leap into electronic
              typesetting.
            </p>
          </div>
        </>
      );
    }
    case 'scanActions': {
      return (
        <div>
          <b className={styles.modalTitle}>Void scan</b>
          <img
            src="https://qa.media.lims.mirimus.com/void-scan.gif"
            alt="void-scan"
          />
          <p className={styles.tipDescription}>
            Lorem Ipsum has been the industry's standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only
            five centuries, Lorem Ipsum
          </p>
        </div>
      );
    }
    case 'saveScan': {
      return (
        <div>
          <b className={styles.modalTitle}>Save scan</b>
          <img
            src="https://qa.media.lims.mirimus.com/save-scan.gif"
            alt="void-scan"
          />
          <p className={styles.tipDescription}>
            Lorem Ipsum has been the industry's standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only
            five centuries, Lorem Ipsum
          </p>
        </div>
      );
    }
    default:
      return null;
  }
};

const InfoModal = ({ type }) => {
  const tips = useTip(type);

  return (
    <Carousel adaptiveHeight autoplay autoplaySpeed={4000}>
      {tips}
    </Carousel>
  );
};

export default InfoModal;
