import { combineReducers } from 'redux'
import single from 'redux/factories/single'
import actions from './actions'

const initialState = {
  items: [],
  error: null,
}

const campaignsReducer = (state = initialState, action) => {
  switch (action.type) {
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
