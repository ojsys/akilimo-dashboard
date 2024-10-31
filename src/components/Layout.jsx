import React from 'react';
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired
};

export default Layout;
