'use client';

import Header from '@/components/user/layout/Header';
import SideNav from '@/components/user/layout/SideNav';
import SideNavMob from '@/components/user/layout/SideNavMob';
import { useSowBreadCrumbs } from '@/context/SowBreadCrumbs';
import { useEffect } from 'react';

function Layout({ children }: { children: React.ReactNode }) {
  const { setShow } = useSowBreadCrumbs();

  useEffect(() => {
    setShow(true);
  }, [setShow]);

  return (
    <div className="course-section grid grid-cols-4 gap-8 px-2 pb-25 lg:px-15">
      <SideNavMob />
      <SideNav />
      <div className="col-span-3 space-y-6 max-xl:col-span-4">
        <Header />
        {children}
      </div>
    </div>
  );
}

export default Layout;
