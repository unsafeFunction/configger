import React, { useCallback } from 'react';
import DefaultModal from 'components/widgets/DefaultModal';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/modal/actions';

const ConfirmModal = (props) => {
  const modal = useSelector((state) => state.modal);

  const dispatch = useDispatch();

  const onCancel = useCallback(() => {
    dispatch({ type: actions.HIDE_MODAL });
  }, [dispatch]);

  const onOk = useCallback(() => {
    props.onOk();

    dispatch({ type: actions.HIDE_MODAL });
  }, [dispatch, props]);

  const { message } = props;

  return (
    <DefaultModal
      {...props}
      onOk={onOk}
      onCancel={onCancel}
      isOpen={modal.isOpen}
    >
      {message()}
    </DefaultModal>
  );
};

export default ConfirmModal;
