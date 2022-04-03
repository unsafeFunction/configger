import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTitle = ({ children, title }) => {
  const { pathname, state } = useLocation();
  console.log(pathname);

  useEffect(() => {
    const regexPathname = pathname
      // Find first part of string e.g. "/pool-scans/12345" -> "/pool-scans"
      .match('^(\\/[\\w-]+)')[0]
      // Replace "/" and "-" to spaces and change case
      .replace(/[\/-]\w/g, (match, index) => {
        return index === 0
          ? match[1].toUpperCase()
          : ` ${match[1].toUpperCase()}`;
      });

    // Check "extraInfo" if need info about
    const formattedPathname = state?.extraInfo
      ? `${regexPathname} ${state.extraInfo}`
      : regexPathname;

    document.title = `LIMS | ${title ? title : formattedPathname}`;
  }, []);

  return children;
};

export default PageTitle;
