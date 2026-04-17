import { Link, useLocation } from 'react-router-dom';
import { Home, List } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 w-full md:w-[400px] bg-white border-t border-gray-200 flex justify-around p-3 z-50">
      <Link
        to="/"
        className={`flex flex-col items-center p-2 ${location.pathname === '/' ? 'text-emerald-600' : 'text-gray-400'}`}
      >
        <Home size={24} />
        <span className="text-xs font-medium mt-1">Beranda</span>
      </Link>

      <Link
        to="/logs"
        className={`flex flex-col items-center p-2 ${location.pathname === '/logs' ? 'text-emerald-600' : 'text-gray-400'}`}
      >
        <List size={24} />
        <span className="text-xs font-medium mt-1">Riwayat</span>
      </Link>
    </nav>
  );
};

export default Navbar;
