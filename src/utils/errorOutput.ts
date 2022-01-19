type DataProps = {
  detail: string;
  details: string;
  field_errors: string[];
};
type ResponseProps = {
  data: DataProps;
};
type ErrorProps = {
  response: ResponseProps;
};

const errorOutput = (error: ErrorProps): string | ErrorProps => {
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
  return error;
};

export default errorOutput;
