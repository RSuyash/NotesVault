import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// Assuming useAuth hook exists and provides logout function
// import { useAuth } from '../../hooks/useAuth'; // Adjust path if needed - HOOK NOT FOUND

const SidebarNav: React.FC = () => {
  const navigate = useNavigate();
  // const { logout } = useAuth(); // Assuming useAuth returns { logout: () => void } - HOOK NOT FOUND

  // const handleLogout = async () => {
  //   try {
  //     // await logout(); // Call the logout function from the hook - HOOK NOT FOUND
  //     navigate('/'); // Redirect to login or home page after logout
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //     // Handle logout error (e.g., show a notification)
  //   }
  // };

  // Placeholder links based on FR2.1
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Notes', path: '/notes' },
    { name: 'Flashcards', path: '/flashcards' },
    { name: 'Study Groups', path: '/study-groups' },
    { name: 'Settings', path: '/settings' },
  ];

  // Define active link style
  // Define active link style using CSS variables
  const activeClassName = "bg-[var(--color-primary-lighter)] text-[var(--color-primary)] font-semibold";
  const inactiveClassName = "text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)]";

  return (
    <div className="flex flex-col h-full p-4 bg-[var(--color-surface)] border-r border-[var(--color-border)]">
      {/* Use flex column layout, apply surface background and primary text color */}
      <h2 className="text-xl font-semibold mb-6 text-[var(--color-text-primary)]">NotesVault</h2>
      <nav className="flex-grow"> {/* Nav takes available space */}
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2"> {/* Reduced margin */}
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block p-2 rounded transition-colors duration-150 ${isActive ? activeClassName : inactiveClassName}`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {/* Logout Button at the bottom */}
      <div className="mt-auto"> {/* Pushes button to the bottom */}
        <button
          // onClick={handleLogout} // Re-enable when useAuth/logout is implemented
          // Apply primary button styles using CSS variables and standard padding/text size
          className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-darker)] text-white text-base font-medium py-3 px-6 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SidebarNav;