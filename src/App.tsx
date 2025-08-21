import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
