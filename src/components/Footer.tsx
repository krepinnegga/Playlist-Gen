import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/2024-spotify-full-logo/Spotify_Full_Logo_RGB_Green.png';

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'Playlist Gen', to: '/playlist-gen' },
];

const Footer = () => {
  const location = useLocation();
  return (
    <footer className='w-full bg-spotify-gray-900 text-spotify-white pt-12 pb-8 px-6 relative'>
      {/* Top border accent */}
      <div className='absolute top-0 left-40 md:left-20 w-28 h-1 bg-spotify-brand' />

      {/* Desktop/Tablet Layout */}
      <div className='max-w-7xl mx-auto flex flex-col md:flex-col lg:flex-row lg:justify-between gap-y-8 lg:gap-y-0'>
        {/* Left: Logo and Description */}
        <div className='flex flex-col items-center lg:items-start text-center lg:text-left gap-y-8 lg:gap-y-6 flex-1'>
          <Link
            to='/'
            className='flex items-center justify-center lg:justify-start'
          >
            <img src={Logo} alt='Spotify Playlist Gen' className='h-8' />
          </Link>

          {/* Nav Links (Tablet/Mobile) */}
          <div className='flex flex-col gap-y-4 md:flex-row md:gap-x-8 md:justify-center md:items-center lg:hidden'>
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.to}
                className={`font-medium tracking-wider transition-colors duration-200 ${
                  location.pathname === link.to
                    ? 'text-spotify-brand'
                    : 'text-spotify-gray-400 hover:text-spotify-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <p className='text-spotify-gray-400 text-sm md:text-base max-w-lg mx-auto lg:mx-0'>
            Playlist Generator is an all in one stop to fulfill your audio
            needs. We're a small team of Spotify lovers who are devoted to
            helping you get the most out of personalizing your Spotify playlist.
          </p>

          <p className='text-spotify-gray-500 text-xs md:text-sm font-medium mt-8 lg:mt-auto'>
            Copyright 2025. All Rights Reserved (we are not associated with
            Spotify)
          </p>
        </div>

        {/* Right: Nav Links (Desktop) and Socials */}
        <div className='flex flex-col items-center lg:items-end justify-between flex-1 gap-y-8 lg:gap-y-0'>
          {/* Nav Links (Desktop) */}
          <div className='hidden lg:flex gap-x-8 mb-8'>
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.to}
                className={`font-medium tracking-wider transition-colors duration-200 ${
                  location.pathname === link.to
                    ? 'text-spotify-brand'
                    : 'text-spotify-gray-400 hover:text-spotify-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Social Icons */}
          <div className='flex gap-x-6 mt-8 lg:mt-auto'>
            {/* Facebook */}
            <a
              href='https://facebook.com'
              target='_blank'
              rel='noopener noreferrer'
              className='group cursor-pointer'
            >
              <span className='inline-block p-1 rounded-full bg-spotify-gray-700 hover:bg-spotify-gray-600 transition-colors duration-200'>
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-spotify-gray-300 group-hover:text-spotify-green-dark transition-colors duration-200'
                >
                  <path
                    d='M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z'
                    fill='currentColor'
                  />
                </svg>
              </span>
            </a>

            {/* Twitter */}
            <a
              href='https://twitter.com'
              target='_blank'
              rel='noopener noreferrer'
              className='group cursor-pointer'
            >
              <span className='inline-block p-1 rounded-full bg-spotify-gray-700 hover:bg-spotify-gray-600 transition-colors duration-200'>
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 20'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-spotify-gray-300 group-hover:text-spotify-green-dark transition-colors duration-200'
                >
                  <path
                    d='M24 2.557a9.83 9.83 0 01-2.828.775A4.932 4.932 0 0023.337.608a9.864 9.864 0 01-3.127 1.195A4.916 4.916 0 0016.616.248c-3.179 0-5.515 2.966-4.797 6.045A13.978 13.978 0 011.671 1.149a4.93 4.93 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 17.54a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.721 13.995-14.646A10.025 10.025 0 0024 2.557z'
                    fill='currentColor'
                  />
                </svg>
              </span>
            </a>

            {/* Instagram */}
            <a
              href='https://instagram.com'
              target='_blank'
              rel='noopener noreferrer'
              className='group cursor-pointer'
            >
              <span className='inline-block p-1 rounded-full bg-spotify-gray-700 hover:bg-spotify-gray-600 transition-colors duration-200'>
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-spotify-gray-300 group-hover:text-spotify-green-dark transition-colors duration-200'
                >
                  <path
                    d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'
                    fill='currentColor'
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
