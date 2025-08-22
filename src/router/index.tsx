import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Gallery from '../pages/Gallery';
import Preview from '../pages/Preview';
import PrintManager from '../pages/PrintManager';
import Search from '../pages/Search';
import Auth from '../pages/Auth';
import Favorites from '../pages/Favorites';
import Settings from '../pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'gallery',
        element: <Gallery />,
      },
      {
        path: 'gallery/:category',
        element: <Gallery />,
      },
      {
        path: 'preview/:styleId',
        element: <Preview />,
      },
      {
        path: 'print-manager',
        element: <PrintManager />,
      },
      {
        path: 'search',
        element: <Search />,
      },
      {
         path: 'auth',
         element: <Auth />,
       },
       {
         path: 'favorites',
         element: <Favorites />,
       },
       {
         path: 'settings',
         element: <Settings />,
       },
    ],
  },
]);