'use client';

import { useEffect, useState } from 'react';

export default function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      const large = window.innerWidth >= 1024;
      setIsLargeScreen(large);
      setIsOpen(large); // Auto-open sidebar on large screens
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);

    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const toggle = () => {
    // On small screens, allow toggling
    if (!isLargeScreen) {
      setIsOpen(prev => !prev);
    }
  };

  return {
    isOpen,
    isLargeScreen,
    toggle,
  };
}
