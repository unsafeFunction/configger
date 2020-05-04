import { createSelector } from 'reselect'

const singleCampaign = state => {
  return state.campaigns.singleCampaign
}

export const getCampaign = createSelector(singleCampaign, campaign => {
  return campaign
})
