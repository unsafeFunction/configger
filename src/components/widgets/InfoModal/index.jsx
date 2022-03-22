import React from 'react';
import { Carousel } from 'antd';
import styles from './styles.module.scss';

const useTip = (type) => {
  switch (type) {
    case 'saveSession': {
      return (
        <div>
          <b className={styles.modalTitle}>Save session</b>
          <p className={styles.tipDescription}>
            <p>
              1.Saves all scans that have the status “Completed” in the history
              table then ends the session.
            </p>
            <p>
              2.Save the session once you are done scanning all samples for one
              company, including rejected samples if there are any.
            </p>
          </p>
          <img
            className={styles.image}
            src="https://qa.media.lims.mirimus.com/save-session.gif"
            alt="save-session"
          />
        </div>
      );
    }
    case 'cancelSession': {
      return (
        <div>
          <b className={styles.modalTitle}>Cancel session</b>
          <p className={styles.tipDescription}>
            <p>
              1. Permanently deletes all scans in the session then ends the
              session.
            </p>
            <p>
              2.Cancel the session if you don’t plan to scan samples or if you
              want to start over.
            </p>
          </p>
          <img
            className={styles.image}
            src="https://qa.media.lims.mirimus.com/close-session.gif"
            alt="cancel-session"
          />
        </div>
      );
    }
    case 'scanActions': {
      return (
        <div>
          <b className={styles.modalTitle}>Void scan</b>
          <p className={styles.tipDescription}>
            Permanently deletes the scan that is currently displayed on the scan
            table.
          </p>
          <img
            className={styles.image}
            src="https://qa.media.lims.mirimus.com/void-scan.gif"
            alt="void-scan"
          />
        </div>
      );
    }
    case 'saveScan': {
      return (
        <div>
          <b className={styles.modalTitle}>Save scan</b>
          <p className={styles.tipDescription}>
            <p>
              1.Saves all samples displayed on the scan table and associates the
              scan with a pool name.
            </p>
            <p>2.Once a scan is saved, the scan cannot be edited.</p>
          </p>
          <img
            className={styles.image}
            src="https://qa.media.lims.mirimus.com/save-scan.gif"
            alt="void-scan"
          />
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
