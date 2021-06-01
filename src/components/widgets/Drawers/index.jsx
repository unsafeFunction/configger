import { Drawer } from 'antd';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/drawer/actions';

const DefaultDrawer = () => {
  const dispatch = useDispatch();

  const { drawerProps, content, isOpen } = useSelector((state) => state.drawer);

  const onClose = useCallback(() => {
    dispatch({ type: actions.HIDE_DRAWER });
  }, [dispatch]);

  return (
    <Drawer visible={isOpen} onClose={onClose} {...drawerProps}>
      {content?.()}
    </Drawer>
  );
};

export default DefaultDrawer;
