const nameWithExtension = (name = '', contentType = 'application/json') => {
  switch (contentType) {
    case 'text/csv': {
      return `${name}.csv`;
    }
    case 'text/plain': {
      return `${name}.txt`;
    }

    default:
      return name;
  }
};

export default nameWithExtension;
