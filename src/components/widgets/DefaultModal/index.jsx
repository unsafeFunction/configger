import React, { useEffect } from 'react';
import useKeyPress from 'hooks/useKeyPress';
import { Modal } from 'antd';
import { useSelector } from 'react-redux';

const DefaultModal = (props) => {
  const isLoading = useSelector((state) => state.modal.isLoading);
  const enterPress = useKeyPress('Enter');

  const {
    type,
    isOpen,
    title,
    children,
    onOk,
    onCancel,
    width,
    okButtonProps,
  } = props;

  const formattedOkButtonProps = okButtonProps
    ? Object.assign(okButtonProps, {
        loading: isLoading,
      })
    : { loading: isLoading };

  useEffect(() => {
    if (enterPress) {
      onOk();
    }
  }, [enterPress, onOk]);

  return (
    <Modal
      title={title}
      visible={isOpen}
      type={type}
      onOk={onOk}
      onCancel={onCancel}
      width={width}
      okButtonProps={formattedOkButtonProps}
      {...props}
    >
      {children}
    </Modal>
  );
};

export default DefaultModal;
