import React from 'react';
import { Button, Tooltip } from 'antd';
import { InfoOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import InfoModal from 'components/widgets/InfoModal';
import modalActions from 'redux/modal/actions';
import styles from './style.module.scss';

const InfoButton = () => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch({
      type: modalActions.SHOW_MODAL,
      modalType: 'COMPLIANCE_MODAL',
      modalProps: {
        title: 'Info',
        message: () => <InfoModal />,
      },
    });
  };

  return (
    <Tooltip title="info">
      <Button
        onClick={() => handleClick()}
        shape="circle"
        size="small"
        icon={<InfoOutlined />}
        className={styles.infoButton}
      />
    </Tooltip>
  );
};

export default InfoButton;
