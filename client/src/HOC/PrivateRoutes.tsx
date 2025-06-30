import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useUserStore } from '../store/index';

interface PrivateRoutes {
  children: ReactNode;
}

const PrivateRoutes = ({ children }: PrivateRoutes) => {
  const { user } = useUserStore.getState();

  return user?.accessToken ? children : <Navigate to='/' />;
};

export default PrivateRoutes;
