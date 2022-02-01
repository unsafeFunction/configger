import React from 'react';
import { Button, Tooltip } from 'antd';
import { InfoOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import InfoModal from 'components/widgets/InfoModal';
import modalActions from 'redux/modal/actions';
import styles from './style.module.scss';

const InfoButton = ({ type }) => {
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch({
      type: modalActions.HIDE_MODAL,
    });
  };
  const handleClick = () => {
    dispatch({
      type: modalActions.SHOW_MODAL,
      modalType: 'COMPLIANCE_MODAL',
      modalProps: {
        title: 'Session tips',
        bodyStyle: {
          height: '40vh',
          overflow: 'auto',
        },
        onOk: handleCloseModal,
        cancelButtonProps: { className: styles.hiddenButton },
        message: () => <InfoModal type={type} />,
      },
    });
  };

  return (
    <Tooltip title="Click to view tips">
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
