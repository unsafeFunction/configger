import values from './params';

const layoutHook = (kfpParam) => {
  if (kfpParam === values.oneKFP) {
    return { min: 1, max: 2 };
  }
  return { min: 3, max: 4 };
};

export default layoutHook;
