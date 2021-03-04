import axiosClient from 'utils/axiosClient';

export const fetchInventory = async query => {
  try {
    const inventory = await axiosClient.get('/inventory/', {
      params: {
        ...query,
      },
    });

    return inventory;
  } catch (error) {
    throw new Error(error);
  }
};

export const createInventoryItem = async data => {
  try {
    const inventoryItem = await axiosClient.post('/inventory/', data);
    return inventoryItem;
  } catch (error) {
    throw new Error(error);
  }
};
