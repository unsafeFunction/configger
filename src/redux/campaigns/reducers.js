import { combineReducers } from 'redux'
import single from 'redux/factories/single'
import actions from './actions'

const data = []
// eslint-disable-next-line no-plusplus
for (let i = 0; i < 5; i++) {
  data.push({
    id: i,
    key: `SMS 20SF | FEMALE | ${i} - ${i + 1}`,
    name: 'name',
    status: 'status',
    delivered: `${i} %`,
    clicks: `${i} %`,
    edited: `${i} minutes ago`,
    actions: 'Delete'
  })
}

const initialState = {
  items: data,
  error: null,
  isLoading: false,
}

const campaignsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOAD_CAMPAIGN_REQUEST:
      return {
        ...state,
        isLoading: false
      }
      case actions.LOAD_CAMPAIGN_SUCCESS:
        return {
          ...state,
          isLoading: true
        }
    case actions.CREATE_CAMPAIGN_REQUEST:
      return {
        ...state,
        isLoading: true,
    };
   case actions.CREATE_CAMPAIGN_SUCCESS:
    return Object.assign({}, state, {
      items: [...state.items, action.payload],
      isLoading: false
    })
   case actions.CREATE_CAMPAIGN_FAILURE: {
      return {
        isLoading: false,
        error: action.payload
      }
   }
   default:
      return state
  }
}

const initialSingleCampaign = {
  title: '',
  key: '',
  body: '',
  destination: '',
  deeplink: '',
  error: null,
}

export default combineReducers({
  all: campaignsReducer,
  singleNote: single({
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
