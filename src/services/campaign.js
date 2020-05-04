import axiosClient from 'utils/axiosClient'

export const loadCampaigns = async (page = 1) => {
  try {
    const campaigns = await axiosClient.get('/campaigns', {
      page,
    })

    return campaigns
  } catch (error) {
    return error
  }
}

export const deleteCampaign = async id => {
  try {
    const campaigns = await axiosClient.delete(`/campaigns/${id}`)

    return campaigns
  } catch (error) {
    return error
  }
}

export const createCampaign = async payload => {
  try {
    const campaign = await axiosClient.post(`/campaigns`, payload)

    return campaign
  } catch (error) {
    return error
  }
}
