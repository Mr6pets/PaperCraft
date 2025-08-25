import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from '../App';

// 懒加载页面组件
const Home = lazy(() => import('../pages/Home'));
const Gallery = lazy(() => import('../pages/Gallery'));
const Preview = lazy(() => import('../pages/Preview'));
const PrintManager = lazy(() => import('../pages/PrintManager'));
const Search = lazy(() => import('../pages/Search'));
const Auth = lazy(() => import('../pages/Auth'));
const Favorites = lazy(() => import('../pages/Favorites'));
const Settings = lazy(() => import('../pages/Settings'));

// 加载组件包装器
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0EA5E9]"></div>
    </div>
  }>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LazyWrapper><Home /></LazyWrapper>,
      },
      {
        path: 'gallery',
        element: <LazyWrapper><Gallery /></LazyWrapper>,
      },
      {
        path: 'gallery/:category',
        element: <LazyWrapper><Gallery /></LazyWrapper>,
      },
      {
        path: 'preview/:styleId',
        element: <LazyWrapper><Preview /></LazyWrapper>,
      },
      {
        path: 'print-manager',
        element: <LazyWrapper><PrintManager /></LazyWrapper>,
      },
      {
        path: 'search',
        element: <LazyWrapper><Search /></LazyWrapper>,
      },
      {
         path: 'auth',
         element: <LazyWrapper><Auth /></LazyWrapper>,
       },
       {
         path: 'favorites',
         element: <LazyWrapper><Favorites /></LazyWrapper>,
       },
       {
         path: 'settings',
         element: <LazyWrapper><Settings /></LazyWrapper>,
       },
    ],
  },
]);