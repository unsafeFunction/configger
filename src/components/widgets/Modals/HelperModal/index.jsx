/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'antd';
import DefaultModal from 'components/widgets/DefaultModal';
import actions from 'redux/modal/actions';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const HelperModal = React.memo((props) => {
  const modal = useSelector((state) => state.modal);

  const dispatch = useDispatch();

  const onCancel = () => {
    const { onCancel } = props;

    if (onCancel) {
      onCancel();
    }

    dispatch({ type: actions.HIDE_MODAL });
  };

  const { message } = props;

  switch (modal.modalType) {
    case 'COMPLIANCE_MODAL': {
      return (
        <DefaultModal {...props} onCancel={onCancel} isOpen={modal.isOpen}>
          {message()}
        </DefaultModal>
      );
    }
    case 'WARNING_MODAL': {
      Modal.confirm({
        ...props,
        icon: <ExclamationCircleOutlined color="#faad14" />,
        onCancel,
        content: message(),
      });
      return null;
    }
    default:
      return null;
  }
});

export default HelperModal;
