import { Link, useLocation } from 'react-router-dom';
import { Menu, X, UserRound } from 'lucide-react';
import { useState } from 'react';
import Logo from '../assets/2024-spotify-full-logo/Spotify_Full_Logo_RGB_Green.png';

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'Playlist Gen', to: '/playlist-gen' },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = false;

  return (
    <nav className='w-full bg-spotify-black text-spotify-white fixed z-50 shadow-spotify-md'>
      <div className='max-w-7xl mx-auto relative'>
        {/* Desktop/Tablet Nav */}
        <div className='hidden md:block'>
          <div className='max-w-7xl mx-auto px-6'>
            <div className='flex items-center justify-between w-full py-4'>
              {/* Logo */}
              <Link to='/' className='flex items-center'>
                <img src={Logo} alt='Spotify Playlist Gen' className='h-10' />
              </Link>

              {/* Nav Links */}
              <div className='flex gap-x-10'>
                {navLinks.map(link => (
                  <Link
                    key={link.name}
                    to={link.to}
                    className={`py-4 px-6 font-medium ${
                      location.pathname === link.to
                        ? 'text-spotify-brand'
                        : 'text-spotify-white hover:text-spotify-gray-300'
                    } transition-colors duration-200`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Auth Button */}
              {!isAuthenticated ? (
                <button
                  className='bg-spotify-white text-spotify-black rounded-full px-6 py-2 font-bold hover:scale-105 transition-transform duration-200'
                  onClick={() => {}}
                >
                  Log in
                </button>
              ) : (
                <button
                  className='flex items-center gap-2 bg-spotify-gray-800 hover:bg-spotify-gray-700 rounded-full px-4 py-2 transition-colors duration-200'
                  onClick={() => {}}
                >
                  <UserRound size={20} />
                  <span className='font-medium'>Log out</span>
                </button>
              )}
            </div>
            <div className='w-full h-px bg-spotify-gray-700' />
          </div>
        </div>

        {/* Mobile Nav */}
        <div className='md:hidden'>
          <div className='flex items-center justify-between w-full px-4 py-4'>
            {/* Menu Button */}
            <button
              className='flex items-center'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X size={24} className='text-spotify-white' />
              ) : (
                <Menu size={24} className='text-spotify-white' />
              )}
            </button>

            {/* Logo */}
            <Link to='/' className='flex items-center'>
              <img src={Logo} alt='Spotify Playlist Gen' className='h-8' />
            </Link>

            {/* Auth Button */}
            {!isAuthenticated ? (
              <button
                className='bg-spotify-white text-spotify-black rounded-full px-4 py-1.5 text-sm font-bold'
                onClick={() => {}}
              >
                Log in
              </button>
            ) : (
              <button
                className='flex items-center gap-1 bg-spotify-gray-800 rounded-full px-3 py-1.5'
                onClick={() => {}}
              >
                <UserRound size={16} />
                <span className='text-sm font-medium'>Log out</span>
              </button>
            )}
          </div>
          <div className='w-full h-px bg-spotify-gray-700' />
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className='md:hidden absolute top-full left-0 w-full bg-spotify-gray-900 z-50 shadow-spotify-lg'>
            <div className='flex flex-col divide-y divide-spotify-gray-800'>
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.to}
                  className={`py-4 px-6 font-medium ${
                    location.pathname === link.to
                      ? 'text-spotify-brand'
                      : 'text-spotify-white hover:text-spotify-gray-300'
                  } transition-colors duration-200`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
