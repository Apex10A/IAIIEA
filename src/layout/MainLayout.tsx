// src/layout/MainLayout.tsx

import React from 'react';
import Header from '@/components/layout/header/page';
import Footer from '@/components/layout/footer/page';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
