import React from 'react';
import ContentLoader from 'react-content-loader';
import i18n from '../i18n/i18n';

const SkeletonCard = (props) => (
  <ContentLoader 
    speed={2}
    width="100%"
    height={220}
    rtl={i18n.language === "ar" && true}
    viewBox="0 0 300 220"
    backgroundColor="#f3f3f3"
    foregroundColor="#9e9e9e94"
    {...props}
  >
    <rect x="0" y="0" rx="4" ry="4" width="100%" height="120" />
    <rect x="0" y="130" rx="3" ry="3" width="80%" height="15" />
    <rect x="0" y="155" rx="3" ry="3" width="60%" height="15" />
  </ContentLoader>
);

const ResponsiveSkeletonGrid = () => {
  return (
    <div className="row g-4">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="col-xl-3 col-lg-3 col-md-6 col-12"
        >
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
};

export default ResponsiveSkeletonGrid;
