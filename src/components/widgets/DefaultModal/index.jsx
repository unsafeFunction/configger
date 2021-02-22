import React, { Component } from 'react';
import { Modal } from 'antd';

class DefaultModal extends Component {
  render() {
    const { type, isOpen, title, children, onOk, onCancel, width } = this.props;

    return (
      <Modal
        title={title}
        visible={isOpen}
        type={type}
        onOk={onOk}
        onCancel={onCancel}
        width={width}
        {...this.props}
      >
        {children}
      </Modal>
    );
  }
}

export default DefaultModal;
