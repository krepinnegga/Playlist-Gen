import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface PrivateRoutes {
  children: ReactNode;
}

const PrivateRoutes = ({ children }: PrivateRoutes) => {
  const user = {
    token: '',
  };

  return user?.token ? children : <Navigate to='/' />;
};

export default PrivateRoutes;
