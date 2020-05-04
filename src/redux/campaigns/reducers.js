import { combineReducers } from 'redux'
import single from 'redux/factories/single'
import actions from './actions'

const initialState = {
  items: [],
  error: null,
  isLoading: false,
}

const campaignsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOAD_CAMPAIGN_REQUEST: {
      return {
        ...state,
        isLoading: false,
      }
    }
    case actions.LOAD_CAMPAIGN_SUCCESS: {
      return {
        items: action.payload.map(campaign => {
          return {
            ...campaign,
            action: null,
          }
        }),
        isLoading: true,
      }
    }
    case actions.REMOVE_CAMPAIGN_REQUEST: {
      return {
        ...state,
        isLoading: false,
      }
    }
    case actions.REMOVE_CAMPAIGN_SUCCESS: {
      return {
        items:
          action.payload.status === 204 &&
          state.items.filter(campaign => {
            return campaign.id !== action.payload.id
          }),
        isLoading: true,
      }
    }
    case actions.CREATE_CAMPAIGN_REQUEST:
      return {
        ...state,
        isLoading: false,
      }
    case actions.CREATE_CAMPAIGN_SUCCESS:
      return {
        ...state,
        items: [...state.items, action.payload.data],
        isLoading: true,
      }
    case actions.CREATE_CAMPAIGN_FAILURE: {
      return {
        isLoading: false,
        error: action.payload,
      }
    }
    default:
      return state
  }
}

const initialSingleCampaign = {
  title: '',
  key: '',
  smsBody: '',
  destination: '',
  fromNumber: '+17739662558',
  originalLink: 'https://oa-sms-offers-dev.herokuapp.com',
  deepLinkDomain: 'https://oa-sms-offers-dev.herokuapp.com/o',
  trackingEnabled: false,
  conversationEnabled: false,
  error: null,
}

export default combineReducers({
  all: campaignsReducer,
  singleCampaign: single({
    types: [],
  })((state = initialSingleCampaign, action = {}) => {
    switch (action.type) {
      case actions.ON_CAMPAIGN_DATA_CHANGE:
        return Object.assign({}, state, { [action.payload.name]: action.payload.value })
      default: {
        return state
      }
    }
  }),
})
