import { useRouteError, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RouteError {
  statusText?: string;
  message?: string;
  status?: number;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;
  const [showDetails, setShowDetails] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Log error to console
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='min-h-screen bg-spotify-black text-spotify-white flex flex-col items-center justify-center p-6'
    >
      <motion.div
        variants={itemVariants}
        className='max-w-2xl w-full bg-spotify-gray-900 border border-spotify-gray-700 rounded-lg p-8 shadow-spotify-lg'
      >
        {/* Animated 404 text */}
        <motion.div
          variants={itemVariants}
          className='flex justify-center mb-8'
        >
          <div className='relative'>
            <span className='text-7xl font-bold text-spotify-brand'>
              {error.status || '404'}
            </span>
          </div>
        </motion.div>

        {/* Main message */}
        <motion.h1
          variants={itemVariants}
          className='text-3xl font-bold text-center mb-4'
        >
          Oops! Something went wrong
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className='text-spotify-gray-400 text-center mb-8 text-lg'
        >
          {error.statusText ||
            error.message ||
            "The page you're looking for doesn't exist."}
        </motion.p>

        {/* Interactive buttons */}
        <motion.div
          variants={itemVariants}
          className='flex flex-col sm:flex-row gap-4 justify-center'
        >
          <Link
            to='/'
            className='bg-spotify-brand text-spotify-black font-bold rounded-full px-6 py-3 
                     hover:bg-spotify-green-light hover:scale-105 transition-all duration-200
                     flex items-center justify-center gap-2'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z'
                clipRule='evenodd'
              />
            </svg>
            Return Home
          </Link>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className='bg-spotify-gray-700 text-spotify-white font-bold rounded-full px-6 py-3
                     hover:bg-spotify-gray-600 transition-colors duration-200
                     flex items-center justify-center gap-2'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                clipRule='evenodd'
              />
            </svg>
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </motion.div>

        {/* Error details (collapsible) */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className='mt-8 bg-spotify-gray-800 rounded-lg p-4 overflow-hidden'
          >
            <h3 className='text-lg font-bold text-spotify-brand mb-2'>
              Error Details:
            </h3>
            <pre className='text-spotify-gray-300 overflow-x-auto text-sm'>
              {JSON.stringify(error, null, 2)}
            </pre>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
