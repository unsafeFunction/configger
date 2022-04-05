import React from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';
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
      <QuestionCircleTwoTone
        twoToneColor="#248fb3"
        className={styles.infoButton}
        onClick={handleClick}
      />
    </Tooltip>
  );
};

export default InfoButton;
