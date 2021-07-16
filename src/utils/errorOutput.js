const errorOutput = (error) => {
  if (error?.response?.data.detail) {
    const err = error.response.data.detail;
    return err;
  }
  if (error?.response?.data.field_errors) {
    const err = error.response.data.field_errors;
    return Object.values(err).join(' ');
  }
  return error;
};

export default errorOutput;
