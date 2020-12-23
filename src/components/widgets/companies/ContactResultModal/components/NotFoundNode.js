import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import style from '../styles.module.scss';
const NotFoundNode = () => {
  return (
    <div className={style.notFoundNodeWrapper}>
      <CloseOutlined />
      <p>Not found</p>
    </div>
  );
};

export default NotFoundNode;
