import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider';
import Home from './pages/Home';
import PlaylistGen from './pages/PlayListGen';
import ErrorPage from './pages/Error';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/playlist-gen',
      element: <PlaylistGen />,
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
