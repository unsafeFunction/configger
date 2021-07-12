const errorOutput = (error) => {
  if (error?.response?.data.field_errors) {
    const err = error.response.data.field_errors;
    // This split array of erros to separate and join them to string
    return JSON.stringify(err, null, 2).replace(/{|}|"|,/g, '');
  }
  if (error?.response?.data.detail) {
    const err = error.response.data.detail;
    return err;
  }
  return error;
};

export default errorOutput;
