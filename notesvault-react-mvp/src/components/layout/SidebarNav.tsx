import React from 'react';

const SidebarNav: React.FC = () => {
  // Placeholder links based on FR2.1
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Notes', path: '/notes' },
    { name: 'Flashcards', path: '/flashcards' },
    { name: 'Study Groups', path: '/study-groups' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 hidden md:block h-screen sticky top-0"> {/* Basic styling & responsive hide */}
      <h2 className="text-xl font-semibold mb-6">NotesVault</h2>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-3">
              {/* Basic link - routing/active state TBD */}
              <a href={item.path} className="hover:bg-gray-700 p-2 rounded block">
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarNav;