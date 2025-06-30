import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider';
import Home from './pages/Home';
import PlaylistGen from './pages/PlayListGen';
import ErrorPage from './pages/Error';
import PrivateRoutes from './HOC/PrivateRoutes';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/playlist-gen',
      element: (
        <PrivateRoutes>
          <PlaylistGen />
        </PrivateRoutes>
      ),
      errorElement: <ErrorPage />,
    },
  ]);

  return (
    <ThemeProvider storageKey='theme'>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
