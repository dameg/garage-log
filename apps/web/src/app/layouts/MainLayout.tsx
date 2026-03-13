import { Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <div className="flex-1 overflow-auto p-4">
      Test
      <Outlet />
    </div>
  );
}
