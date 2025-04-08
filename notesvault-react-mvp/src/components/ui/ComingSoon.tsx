import React from 'react';
import './ComingSoon.css';

const ComingSoon: React.FC = () => {
  return (
    <div className="coming-soon-container">
      <div className="coming-soon-content">
        <h1>🚀 Coming Soon!</h1>
        <p>We're working hard to bring you this feature.</p>
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default ComingSoon;