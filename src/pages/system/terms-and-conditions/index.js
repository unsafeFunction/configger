import React from 'react';
import { Helmet } from 'react-helmet';
import TermsAndConditions from 'components/system/Auth/TermsAndConditions';

class SystemLogin extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Terms and conditions" />
        <TermsAndConditions />
      </div>
    );
  }
}

export default SystemLogin;
