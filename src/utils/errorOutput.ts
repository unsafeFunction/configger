type DataType = {
  detail: string;
  details: string;
  field_errors: string[];
  non_field_errors: string[];
};
type ResponseType = {
  data: DataType;
};
type ErrorType = {
  response: ResponseType;
};

const errorOutput = (error: ErrorType | any): string | ErrorType | any => {
  if (error?.response?.data.detail) {
    const err = error.response.data.detail;
    return err;
  }
  if (error?.response?.data.details) {
    const err = error.response.data.details;
    return err;
  }
  if (error?.response?.data.field_errors) {
    const err = error.response.data.field_errors;
    return Object.values(err).join(' ');
  }
  if (error?.response?.data.non_field_errors) {
    const err = error.response.data.non_field_errors;
    return err;
  }
  return error;
};

export default errorOutput;
