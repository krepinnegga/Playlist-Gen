import axiosInstance from './Config';

export const serviceFetcher = url =>
  axiosInstance.get(url).then(res => res?.data);

const servicePoster = async (url, { arg }) => {
  try {
    const res = await axiosInstance.post(url, {
      ...arg,
    });
    return res;
  } catch (error) {
    console.log(`error in posting => ${url}`, error);
    throw error;
  }
};

export const serviceUpdate = async (url, { arg }) => {
  try {
    const res = await axiosInstance.put(url, {
      ...arg,
    });
    return res;
  } catch (error) {
    console.log(`error in posting => ${url}`, error);
    throw error;
  }
};

export const serviceDelete = async url => {
  try {
    const res = await axiosInstance.delete(url);
    return res?.data;
  } catch (error) {
    console.log('error in deleteAccount', error);
    throw error;
  }
};
