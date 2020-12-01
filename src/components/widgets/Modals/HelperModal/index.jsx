import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'antd';
import DefaultModal from 'components/widgets/DefaultModal';
import actions from 'redux/modal/actions';

const HelperModal = React.memo(props => {
  const modal = useSelector(state => state.modal);

  const dispatch = useDispatch();

  const onCancel = useCallback(() => {
    dispatch({ type: actions.HIDE_MODAL });
  }, [dispatch]);

  const { message } = props;

  switch (modal.modalType) {
    case 'COMPLIANCE_MODAL': {
      return (
        <DefaultModal {...props} onCancel={onCancel} isOpen={modal.isOpen}>
          {message()}
        </DefaultModal>
      );
    }
    default:
      return null;
  }
});

export default HelperModal;
