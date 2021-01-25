import React, { useEffect, useCallback, useReducer } from 'react';
import classNames from 'classnames';
import {
  Typography,
  Col,
  Input,
  Button,
  Form,
  DatePicker,
  InputNumber,
  Checkbox,
  Table,
  Spin,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import actions from 'redux/settings/actions';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';

const columns = [
  {
    title: (
      <div>
        <Input
          className={styles.searchInput}
          bordered={false}
          suffix={<SearchOutlined />}
          size="middle"
          placeholder="Enter a role or permission name"
          maxLength="20"
        />
      </div>
    ),
    dataIndex: 'role',
    width: 50,
    render: (text, { isPermissionHeader }) => {
      return {
        props: {
          style: { background: isPermissionHeader && 'rgb(239, 242, 250)' },
        },
        children: <span>{text}</span>,
      };
    },
  },
  {
    title: 'Read',
    dataIndex: 'read',
    width: 50,
    align: 'center',
    render: (text, { isPermissionHeader }) => {
      return {
        props: {
          style: { background: isPermissionHeader && 'rgb(239, 242, 250)' },
        },
        children: <span>{text}</span>,
      };
    },
  },
  {
    title: 'Create',
    dataIndex: 'create',
    width: 50,
    align: 'center',
    render: (text, { isPermissionHeader }) => {
      return {
        props: {
          style: { background: isPermissionHeader && 'rgb(239, 242, 250)' },
        },
        children: <span>{text}</span>,
      };
    },
  },
  {
    title: 'Update',
    dataIndex: 'update',
    width: 50,
    align: 'center',
    render: (text, { isPermissionHeader }) => {
      return {
        props: {
          style: { background: isPermissionHeader && 'rgb(239, 242, 250)' },
        },
        children: <span>{text}</span>,
      };
    },
  },
  {
    title: 'Delete',
    dataIndex: 'delete',
    width: 50,
    align: 'center',
    render: (text, { isPermissionHeader }) => {
      return {
        props: {
          style: { background: isPermissionHeader && 'rgb(239, 242, 250)' },
        },
        children: <span>{text}</span>,
      };
    },
  },
];

const UserPermissions = () => {
  const { userPermission } = useSelector(state => state.settings);
  const dispatch = useDispatch();

  const onPermissionChange = useCallback(
    (value, role, permissionName, actionName, isAllSelected = false) => {
      dispatch({
        type: actions.SET_USER_PERMISSION,
        payload: {
          role,
          permissionName,
          actionName,
          value,
          isAllSelected,
        },
      });
    },
    [dispatch],
  );

  const getUserPermissionCheckbox = useCallback(
    (userRole, permissionName) => {
      const rolesPermissions = userPermission[userRole][permissionName];
      return {
        create: (
          <Checkbox
            onChange={event =>
              onPermissionChange(
                event.target.checked,
                userRole,
                permissionName,
                'create',
              )
            }
            checked={rolesPermissions.create}
          />
        ),
        read: (
          <Checkbox
            onChange={event =>
              onPermissionChange(
                event.target.checked,
                userRole,
                permissionName,
                'read',
              )
            }
            checked={rolesPermissions.read}
          />
        ),
        update: (
          <Checkbox
            onChange={event =>
              onPermissionChange(
                event.target.checked,
                userRole,
                permissionName,
                'update',
              )
            }
            checked={rolesPermissions.update}
          />
        ),
        delete: (
          <Checkbox
            onChange={event =>
              onPermissionChange(
                event.target.checked,
                userRole,
                permissionName,
                'delete',
              )
            }
            checked={rolesPermissions.delete}
          />
        ),
      };
    },
    [userPermission],
  );

  const getRoleColumn = useCallback(
    role => {
      return [
        {
          key: `pre_scan_${role}`,
          role: <span>Can Pre Scan </span>,
          ...getUserPermissionCheckbox(role, 'pre_scan'),
        },
        {
          key: `pre_scan_${role}`,
          role: <span>Can Pool Scan </span>,
          ...getUserPermissionCheckbox(role, 'pool_scan'),
        },
        {
          key: `pool_rack_${role}`,
          role: <span>Can Pool Rack </span>,
          ...getUserPermissionCheckbox(role, 'pool_rack'),
        },
        {
          key: `prepare_test_${role}`,
          role: <span>Can Prepare Test</span>,
          ...getUserPermissionCheckbox(role, 'prepare_test'),
        },
        {
          key: `review_results_${role}`,
          role: <span>Can Review Results</span>,
          ...getUserPermissionCheckbox(role, 'review_results'),
        },
        {
          key: `management_${role}`,
          role: <span>Can Management</span>,
          ...getUserPermissionCheckbox(role, 'management'),
        },
        {
          key: `view_dashboard_${role}`,
          role: <span>Can View Dashboard</span>,
          ...getUserPermissionCheckbox(role, 'view_dashboard'),
        },
        {
          key: `edit_settings_${role}`,
          role: <span>Can Edit Settings</span>,
          ...getUserPermissionCheckbox(role, 'edit_settings'),
        },
      ];
    },
    [userPermission],
  );

  const getRoleHeaderCheckbox = userRole => {
    return {
      create: (
        <Checkbox
          onChange={event =>
            onPermissionChange(
              event.target.checked,
              userRole,
              null,
              'create',
              true,
            )
          }
        />
      ),
      //   <Checkbox/>,
      update: (
        <Checkbox
          onChange={event =>
            onPermissionChange(
              event.target.checked,
              userRole,
              null,
              'update',
              true,
            )
          }
        />
      ),
      read: (
        <Checkbox
          onChange={event =>
            onPermissionChange(
              event.target.checked,
              userRole,
              null,
              'read',
              true,
            )
          }
        />
      ),
      delete: (
        <Checkbox
          onChange={event =>
            onPermissionChange(
              event.target.checked,
              userRole,
              null,
              'delete',
              true,
            )
          }
        />
      ),
    };
  };

  const data = [
    {
      key: 'admin',
      role: <Typography.Text strong>Admin</Typography.Text>,
      isPermissionHeader: true,
      ...getRoleHeaderCheckbox('admin'),
    },
    ...getRoleColumn('admin'),
    {
      key: 'lab_member',
      role: <Typography.Text strong>Lab Member</Typography.Text>,
      isPermissionHeader: true,
      ...getRoleHeaderCheckbox('lab_member'),
    },
    ...getRoleColumn('lab_member'),
    {
      key: 'intake',
      role: <Typography.Text strong>Intake</Typography.Text>,
      isPermissionHeader: true,
      ...getRoleHeaderCheckbox(''),
    },
    ...getRoleColumn('intake'),
  ];

  return (
    <div>
      <Table
        size="middle"
        className={styles.permissionTable}
        columns={columns}
        dataSource={data}
        pagination={false}
        sticky
        bordered
      />
    </div>
  );
};

export default UserPermissions;
