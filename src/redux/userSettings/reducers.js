import map from 'lodash.map';
import merge from 'lodash.merge';

import actions from './actions';

const initialPermissionValues = {
  create: false,
  update: false,
  read: false,
  delete: false,
};

const initialRolePermissions = {
  pre_scan: initialPermissionValues,
  pool_scan: initialPermissionValues,
  pool_rack: initialPermissionValues,
  prepare_test: initialPermissionValues,
  review_results: initialPermissionValues,
  management: initialPermissionValues,
  view_dashboard: initialPermissionValues,
  edit_settings: initialPermissionValues,
};

const initialState = {
  userPermission: {
    admin: initialRolePermissions,
    lab_member: initialRolePermissions,
    intake: initialRolePermissions,
  },
};

export default function userSettingsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_USER_PERMISSION: {
      const {
        role,
        permissionName,
        actionName,
        value,
        isAllSelected,
      } = action.payload;
      const allSelectedValues = map(
        state.userPermission[role],
        (obj, objectValue, key) => {
          return {
            [objectValue]: {
              ...state.userPermission[role][objectValue],
              [actionName]: value,
            },
          };
        },
      );

      return {
        ...state,
        userPermission: {
          ...state.userPermission,
          [role]: isAllSelected
            ? merge({}, ...allSelectedValues)
            : {
                ...state.userPermission[role],
                [permissionName]: {
                  ...state.userPermission[role][permissionName],
                  [actionName]: value,
                },
              },
        },
      };
    }
    default:
      return state;
  }
}
