import React from 'react';
import NavBar from './Nav';

const ComponentWrapper = ({ children }) => {
  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <NavBar />
          {children}
        </div>
      </div>
    </div>
  )
};

export default ComponentWrapper;