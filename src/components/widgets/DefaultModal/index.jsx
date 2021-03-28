import React, { Component } from 'react';
import { Modal } from 'antd';
import { useSelector } from 'react-redux';

const DefaultModal = (props) => {
  const isLoading = useSelector((state) => state.modal.isLoading);

  const { type, isOpen, title, children, onOk, onCancel, width } = props;

  return (
    <Modal
      title={title}
      visible={isOpen}
      type={type}
      onOk={onOk}
      onCancel={onCancel}
      width={width}
      okButtonProps={{ loading: isLoading }}
      {...props}
    >
      {children}
    </Modal>
  );
};

export default DefaultModal;
