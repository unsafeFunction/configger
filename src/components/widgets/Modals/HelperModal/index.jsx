import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'antd';
import DefaultModal from 'components/widgets/DefaultModal';
import actions from 'redux/modal/actions';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const HelperModal = React.memo(props => {
  const modal = useSelector(state => state.modal);

  const dispatch = useDispatch();

  const onCancel = useCallback(() => {
    dispatch({ type: actions.HIDE_MODAL });
  }, [dispatch]);

  const onOk = useCallback(() => {
    props.onOk();

    dispatch({ type: actions.HIDE_MODAL });
  }, [dispatch]);

  const { message } = props;

  switch (modal.modalType) {
    case 'COMPLIANCE_MODAL': {
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

HelperModal.propTypes = {
  onOk: PropTypes.func,
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
  ]).isRequired,
};

export default HelperModal;
