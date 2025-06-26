
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-gray-400 py-8 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Activity Scheduler. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          Powered by React, Tailwind CSS, and My ❤️.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
    