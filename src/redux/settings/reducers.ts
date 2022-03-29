import store from 'store';
import actions from './actions';

type PayloadProps = {
  data: any;
};

type ActionProps = {
  type: string;
  payload: PayloadProps;
};

export type SettingState = {
  menuLayoutType: string;
  isContentNoMaxWidth: boolean;
  isAppMaxWidth: boolean;
  isGrayBackground: boolean;
  isSquaredBorders: boolean;
  isCardShadow: boolean;
  isBorderless: boolean;
  isTopbarFixed: boolean;
  isGrayTopbar: boolean;
};

const STORED_SETTINGS = (storedSettings: any) => {
  const settings: any = {};
  Object.keys(storedSettings).forEach((key: any) => {
    const item = store.get(`app.settings.${key}`);
    settings[key] = typeof item !== 'undefined' ? item : storedSettings[key];
  });
  return settings;
};

const initialState = {
  ...STORED_SETTINGS({
    isSidebarOpen: true,
    isSupportChatOpen: false,
    isMobileView: false,
    isMobileMenuOpen: false,
    isMenuCollapsed: false,
    isMenuShadow: false,
    isMenuUnfixed: false,
    menuLayoutType: 'left', // left, top, nomenu
    menuType: 'compact', // default, flyout, compact
    menuColor: 'dark', // dark, blue, gray, white
    flyoutMenuColor: 'dark', // dark, blue, gray, white
    systemLayoutColor: 'dark', // white, dark, blue, gray, image
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
};

export default function settingsReducer(
  state = initialState,
  action: ActionProps,
) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
