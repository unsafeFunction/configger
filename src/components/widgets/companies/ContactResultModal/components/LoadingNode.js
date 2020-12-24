import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import style from '../styles.module.scss';
import { Spin } from 'antd';
const LoadingNode = () => {
  return (
    <div className={style.loadingNode}>
      <Spin size="small" />
    </div>
  );
};

export default LoadingNode;
