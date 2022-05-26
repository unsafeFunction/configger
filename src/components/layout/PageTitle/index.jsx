import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTitle = ({ children, title }) => {
  const { pathname, state } = useLocation();
  const checkedTitle = title === null ? '' : title;

  useEffect(() => {
    const formattedPathname = pathname
      // Find first part of string e.g. "/pool-scans/12345" -> "/pool-scans"
      .match('^(\\/[\\w-]+)')[0]
      // Replace "/" and "-" to spaces and change case
      .replace(/[\/-]\w/g, (match, index) => {
        return index === 0
          ? match[1].toUpperCase()
          : ` ${match[1].toUpperCase()}`;
      });

    document.title = `CTW | ${checkedTitle ??
      formattedPathname} ${state?.extraInfo || ''}`;
  }, [state]);

  return children;
};

export default PageTitle;
