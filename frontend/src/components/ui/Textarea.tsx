import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({ error, className = '', ...props }) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-vertical';
  const errorClasses = error ? 'border-red-500' : 'border-gray-300';

  return (
    <textarea
      className={`${baseClasses} ${errorClasses} ${className}`}
      {...props}
    />
  );
};
