'use client';

import { useEffect } from 'react';

export default function HtmlFix() {
  useEffect(() => {
    const el = document.documentElement; // <html>
    if (el.classList.contains('hidden')) {
      el.classList.remove('hidden');
    }
  }, []);
  return null;
}
