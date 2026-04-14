/**
 * 🌐 BrowserApp
 * Aplicação de navegador embutido no Auris OS
 */

import React from 'react';
import { BrowserFrame } from './BrowserFrame';

export const BrowserApp: React.FC = () => {
  return (
    <div className="h-full w-full bg-slate-950">
      <BrowserFrame 
        initialUrl="https://www.google.com"
        className="h-full rounded-none border-0"
      />
    </div>
  );
};
