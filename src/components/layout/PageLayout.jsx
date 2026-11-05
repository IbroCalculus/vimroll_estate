import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CompareTray } from './CompareTray';
import { CommandSearch } from './CommandSearch';
import { ToastViewport } from '../common/ToastViewport';
import { usePropertyStore } from '../../store/usePropertyStore';

export function PageLayout({ children }) {
  const { pathname } = useLocation();
  const hasCompareTray = usePropertyStore((state) => state.compareIds.length > 0);
  const isPropertyDetail = pathname.startsWith('/properties/') && pathname !== '/properties';

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div
      className={`flex min-h-screen flex-col overflow-x-clip bg-[#F7F5F0] text-[#41413D] ${
        hasCompareTray ? 'pb-16' : isPropertyDetail ? 'pb-20 lg:pb-0' : ''
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-[#171816] focus:px-4 focus:py-2.5 focus:text-xs focus:uppercase focus:tracking-widest focus:text-[#F7F5F0]"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <CompareTray />
      <CommandSearch />
      <ToastViewport />
    </div>
  );
}
