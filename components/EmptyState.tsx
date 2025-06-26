import React, { ReactNode } from 'react';
import { InformationCircleIcon } from './icons/InformationCircleIcon'; // Placeholder, use a relevant icon

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: ReactNode;
  actionButton?: ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, icon, actionButton }) => {
  // Define default icon without margin; margin will be on its wrapper
  const defaultIcon = <InformationCircleIcon className="w-16 h-16 text-slate-500" />;
  
  return (
    // The main container already has text-center, which is good for the h3 and p.
    // For icon and button, explicit centering with flex wrappers is more robust.
    <div className="text-center py-12 px-6 bg-slate-800 rounded-lg shadow-md">
      <div className="flex justify-center mb-4"> {/* Icon wrapper for centering */}
        {icon || defaultIcon}
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 mb-4">{message}</p>
      
      {actionButton && (
        // The actionButton passed (e.g., from TodayView) might have its own top margin (like mt-4).
        // This wrapper ensures the button itself is centered.
        <div className="flex justify-center"> {/* Button wrapper for centering */}
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default EmptyState;