const nameWithExtension = (name = '', contentType = 'application/json') => {
  switch (contentType) {
    case 'text/csv': {
      return `${name}.csv`;
    }

    default:
      return name;
  }
};

export default nameWithExtension;
