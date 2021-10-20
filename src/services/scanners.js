/* eslint-disable import/prefer-default-export */
import axiosClient from 'utils/axiosClient';

export const fetchScanners = async () => {
  try {
    const scanners = await axiosClient.get('/scans/scanners/');

    return scanners;
  } catch (error) {
    throw new Error(error?.response?.data.detail);
  }
};

export const fetchScannerById = async (id) => {
  try {
    const scanner = await axiosClient.get(`/scans/scanners/${id}/`);

    return scanner;
  } catch (error) {
    throw new Error(error?.response?.data.detail);
  }
};
