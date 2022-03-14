import axiosClient from 'utils/axiosClient';
import errorOutput from 'utils/errorOutput';

export const fetchScanners = async () => {
  try {
    const scanners = await axiosClient.get('/scans/scanners/');

    return scanners;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};

export const fetchScannerById = async (id) => {
  try {
    const scanner = await axiosClient.get(`/scans/scanners/${id}/`);

    return scanner;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};
