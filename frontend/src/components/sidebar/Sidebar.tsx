import { Film, Heart, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navLinkClasses = "flex items-center px-4 py-2 rounded-md mx-2 transition-colors";
const activeClasses = "bg-blue-700 bg-opacity-50";
const hoverClasses = "hover:bg-blue-700 hover:bg-opacity-50";

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-64 bg-slate-800 text-white sm:relative sm:z-auto sm:inset-auto">
      <Link to="/dashboard" className="flex items-center px-4 py-4 hover:opacity-10 transition-opacity">
        <Film className="w-8 h-8 text-blue-300 mr-2" />
        <span className="text-lg font-semibold">MovieTracker</span>
      </Link>
      <nav className="mt-4">
        <ul>
          <li>
            <Link
              to="/dashboard"
              className={`${navLinkClasses} ${location.pathname === '/dashboard' ? activeClasses : hoverClasses}`}
            >
              <Home className="w-5 h-5 mr-3" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/favorites"
              className={`${navLinkClasses} mt-2 ${location.pathname === '/favorites' ? activeClasses : hoverClasses}`}
            >
              <Heart className="w-5 h-5 mr-3" />
              <span>Favorites</span>
            </Link>
          </li>
          <li>
            <Link
              to="/watched"
              className={`${navLinkClasses} mt-2 ${location.pathname === '/watched' ? activeClasses : hoverClasses}`}
            >
              <Film className="w-5 h-5 mr-3" />
              <span>Watched</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
} 