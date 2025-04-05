import React from 'react';

// Define props interface
interface HeaderBarProps {
  toggleSidebar: () => void; // Function to toggle the sidebar
}

const HeaderBar: React.FC<HeaderBarProps> = ({ toggleSidebar }) => {
  return (
    <></>
  );
};

export default HeaderBar;