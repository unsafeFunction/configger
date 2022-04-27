import actions from './actions';

type ProfileProps = {
  phone_number: string;
  role: string;
};

type PayloadProps = {
  data: any;
  profile: ProfileProps;
  role: string;
};

type ActionProps = {
  type: string;
  payload: PayloadProps;
};

export type UserState = {
  authorized: boolean;
  role: string;
  profile: ProfileProps;
};

const initialState = {
  profile: {},
  authorized: false,
  isLoggingIn: false,
  isRestoring: false,
  isProfileUpdating: false,
  isPasswordChanging: false,
  isVerifyingEmail: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  isRegByEmail: false,
  error: null,
  role: null,
};

export default function userReducer(state = initialState, action: ActionProps) {
  switch (action.type) {
    case actions.LOGIN_REQUEST:
      return {
        ...state,
        isLoggingIn: true,
      };
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        authorized: true,
      };
    case actions.LOGIN_FAILURE:
      return {
        ...state,
        isLoggingIn: false,
      };
    case actions.FORGOT_REQUEST:
      return { ...state, isRestoring: true };
    case actions.FORGOT_SUCCESS:
      return { ...state, isRestoring: false };
    case actions.FORGOT_FAILURE:
      return { ...state, isRestoring: false, error: action.payload.data };
    case actions.RESTORE_REQUEST:
      return { ...state, isRestoring: true };
    case actions.RESTORE_SUCCESS:
      return { ...state, isRestoring: false };
    case actions.RESTORE_FAILURE:
      return { ...state, isRestoring: false, error: action.payload.data };
    case actions.LOGOUT:
      return { ...state, authorized: false };
    case actions.PROFILE_SUCCESS:
      return {
        ...state,
        profile: action.payload.profile,
        role: action.payload.profile.role,
      };
    case actions.PROFILE_FAILURE:
      return { ...state, error: action.payload.data };
    case actions.UPDATE_PROFILE_REQUEST:
      return { ...state, isProfileUpdating: true };
    case actions.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        isProfileUpdating: false,
        profile: {
          ...state.profile,
          ...action.payload.data,
        },
      };
    case actions.UPDATE_PROFILE_FAILURE:
      return { ...state, isProfileUpdating: false, error: action.payload.data };
    case actions.CHANGE_PASSWORD_REQUEST:
      return { ...state, isPasswordChanging: true, error: null };
    case actions.CHANGE_PASSWORD_SUCCESS:
      return { ...state, isPasswordChanging: false };
    case actions.CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        isPasswordChanging: false,
        error: action.payload.data,
      };
    case actions.REPLACE_ROLE:
      return {
        ...state,
        role: action.payload.role,
        profile: {
          ...state.profile,
          role: action.payload.role,
        },
      };

    case actions.VERIFY_EMAIL_REQUEST:
      return { ...state, isVerifyingEmail: 'loading', error: null };
    case actions.VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        isVerifyingEmail: 'succeeded',
      };
    case actions.VERIFY_EMAIL_FAILURE:
      return {
        ...state,
        isVerifyingEmail: 'failed',
        error: action.payload.data,
      };

    case actions.REG_BY_EMAIL_REQUEST:
      return { ...state, isRegByEmail: true, error: null };
    case actions.REG_BY_EMAIL_SUCCESS:
      return {
        ...state,
        isRegByEmail: false,
      };
    case actions.REG_BY_EMAIL_FAILURE:
      return { ...state, isRegByEmail: false, error: action.payload.data };

    default:
      return state;
  }
}
