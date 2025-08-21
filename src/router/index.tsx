import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Gallery from '../pages/Gallery';
import Preview from '../pages/Preview';
import PrintManager from '../pages/PrintManager';
import Search from '../pages/Search';

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
    ],
  },
]);