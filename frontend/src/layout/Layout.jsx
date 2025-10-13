import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import SideBar from './component/Sidebar';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <SideBar />
      <Footer />
    </>
  );
};

export default Layout;
