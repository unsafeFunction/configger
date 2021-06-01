import { Button, Drawer } from 'antd';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/drawer/actions';

const DefaultDrawer = () => {
  const dispatch = useDispatch();

  const { drawerProps, footerProps, content, isOpen, isLoading } = useSelector(
    (state) => state.drawer,
  );

  const onClose = useCallback(() => {
    dispatch({ type: actions.HIDE_DRAWER });
  }, [dispatch]);

  return (
    <Drawer
      visible={isOpen}
      onClose={onClose}
      footer={
        // eslint-disable-next-line react/jsx-wrap-multilines
        <div style={{ textAlign: 'right' }}>
          <Button
            onClick={footerProps.onCancel}
            style={{ marginRight: 8 }}
            loading={isLoading}
          >
            {footerProps.cancelText}
          </Button>
          <Button onClick={footerProps.onOk} type="primary" loading={isLoading}>
            {footerProps.okText}
          </Button>
        </div>
      }
      {...drawerProps}
    >
      {content?.()}
    </Drawer>
  );
};

export default DefaultDrawer;
