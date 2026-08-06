import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DevUserSwitcher from './DevUserSwitcher';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
      <DevUserSwitcher />
    </div>
  );
}