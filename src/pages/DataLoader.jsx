import React from 'react';
import ContentLoader from 'react-content-loader';

const GmailLoader = (props) => {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={500}
      rtl
      viewBox="0 0 100% 160"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="10" y="10" rx="4" ry="4" width="20%" height="10" />
      <rect x="10" y="30" rx="4" ry="4" width="20%" height="10" />
      <rect x="10" y="50" rx="4" ry="4" width="20%" height="10" />
      <rect x="10" y="70" rx="4" ry="4" width="20%" height="10" />
      <rect x="10" y="90" rx="4" ry="4" width="20%" height="10" />

      <rect x="35%" y="10" rx="4" ry="4" width="60%" height="90" />
      <rect x="35%" y="105" rx="4" ry="4" width="30%" height="10" />

      <circle cx="95%" cy="40" r="7" />
      <circle cx="95%" cy="70" r="7" />
      <circle cx="95%" cy="100" r="7" />
    </ContentLoader>
  );
};

export default GmailLoader;
