import React from 'react';

// Define possible icon types
type IconType = 'time' | 'brain' | 'folder' | 'graph' | 'cards' | 'default';

interface PlaceholderIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  iconType?: IconType;
}

// Define SVG paths for each icon type
const iconPaths: Record<IconType, string> = {
  time: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", // Clock
  brain: "M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z", // Simplified brain/structure
  folder: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z", // Folder
  graph: "M16 8v8m-8-8v8m4-12v16M4 12h16", // Simple graph lines
  cards: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2zm12 3H9v2h6V10zm-3 4H9v2h3v-2z", // Stacked cards look
  default: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" // Default clock
};


const PlaceholderIcon: React.FC<PlaceholderIconProps> = ({
  className = "w-6 h-6",
  iconType = 'default',
  ...props
}) => {
  const pathData = iconPaths[iconType] || iconPaths.default;

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d={pathData}></path>
    </svg>
  );
};

export default PlaceholderIcon;
export type { IconType }; // Export the type