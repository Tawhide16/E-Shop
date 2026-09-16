import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { StorefrontLayout } from './components/storefront/StorefrontLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { SEOMeta } from './components/common/SEOMeta';

const MainAppContent: React.FC = () => {
  const { activeView, isAdminAuthenticated } = useStore();

  return (
    <>
      <SEOMeta />
      {activeView === 'admin' ? (
        isAdminAuthenticated ? <AdminLayout /> : <AdminLoginPage />
      ) : (
        <StorefrontLayout />
      )}
    </>
  );
};

export function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}

export default App;
