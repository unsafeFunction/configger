import React from 'react';
import { BackTop } from 'antd';
import styles from './style.module.scss';
import { VerticalAlignTopOutlined } from '@ant-design/icons';

const BackTopComponent = () => {
  return (
    <BackTop>
      <div className={styles.backTop}>
        <VerticalAlignTopOutlined />
      </div>
    </BackTop>
  );
};

export default BackTopComponent;
