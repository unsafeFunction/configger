import store from 'store';
import map from 'lodash.map';

import actions from './actions';

const STORED_SETTINGS = storedSettings => {
  const settings = {};
  Object.keys(storedSettings).forEach(key => {
    const item = store.get(`app.settings.${key}`);
    settings[key] = typeof item !== 'undefined' ? item : storedSettings[key];
  });
  return settings;
};

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
  ...STORED_SETTINGS({
    isSidebarOpen: false,
    isSupportChatOpen: false,
    isMobileView: false,
    isMobileMenuOpen: false,
    isMenuCollapsed: false,
    isMenuShadow: false,
    isMenuUnfixed: false,
    menuLayoutType: 'left', // left, top, nomenu
    menuType: 'default', // default, flyout, compact
    menuColor: 'gray', // dark, blue, gray, white
    flyoutMenuColor: 'dark', // dark, blue, gray, white
    systemLayoutColor: 'gray', // white, dark, blue, gray, image
    isTopbarFixed: false,
    isContentNoMaxWidth: false,
    isAppMaxWidth: false,
    isGrayBackground: false,
    isGrayTopbar: false,
    isCardShadow: false,
    isSquaredBorders: false,
    isBorderless: false,
    routerAnimation: 'slide-fadein-up', // none, slide-fadein-up, slide-fadein-right, fadein, zoom-fadein
  }),

  userPermission: {
    admin: initialRolePermissions,
    lab_member: initialRolePermissions,
    intake: initialRolePermissions,
  },
};

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload };
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
            ? Object.assign({}, ...allSelectedValues)
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
