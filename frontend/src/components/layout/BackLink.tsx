import React from 'react';
import { Link } from 'react-router-dom';

interface BackLinkProps {
  to: string;
  children: React.ReactNode;
}

export const BackLink: React.FC<BackLinkProps> = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4"
    >
      <svg
        className="w-5 h-5 mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {children}
    </Link>
  );
};
