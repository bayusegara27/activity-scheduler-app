
import React from 'react';
import { Activity } from '../types';
import CategoryPill from './CategoryPill';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon'; // For marking as not completed
import { ClockIcon } from './icons/ClockIcon';
import { CalendarIcon } from './icons/CalendarIcon';


interface ActivityItemProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  showDate?: boolean; // Optional prop to show date, useful in "All Activities" list
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onEdit, onDelete, onToggleComplete, showDate = false }) => {
  const { id, name, description, date, startTime, endTime, category, isCompleted } = activity;

  const formattedTime = (time: string) => {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };
  
  return (
    <div className={`p-5 rounded-lg shadow-lg transition-all duration-300 ${isCompleted ? 'bg-slate-700 opacity-70' : 'bg-slate-800 hover:shadow-xl'} border-l-4 ${isCompleted ? 'border-green-500' : 'border-primary-DEFAULT'}`}>
      <div className="flex flex-col sm:flex-row justify-between sm:items-start">
        <div className="flex-grow mb-3 sm:mb-0">
          <div className="flex items-center mb-2">
            {showDate && (
                <span className="text-sm text-gray-400 mr-3 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {new Date(date + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
            )}
            <h3 className={`text-xl font-semibold ${isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>{name}</h3>
          </div>
          {description && <p className={`text-sm text-gray-400 mb-2 ${isCompleted ? 'line-through' : ''}`}>{description}</p>}
          <div className="flex items-center text-xs text-primary-light mb-3">
            <ClockIcon className="w-4 h-4 mr-1" />
            <span>{formattedTime(startTime)} - {formattedTime(endTime)}</span>
          </div>
          <CategoryPill category={category} />
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0 justify-end">
          <button
            onClick={() => onToggleComplete(id)}
            className={`p-2 rounded-full transition-colors duration-150 ${
              isCompleted 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-slate-600 hover:bg-slate-500 text-gray-300 hover:text-white'
            }`}
            title={isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
          >
            {isCompleted ? <XCircleIcon className="w-5 h-5" /> : <CheckCircleIcon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => onEdit(activity)}
            className="p-2 rounded-full bg-secondary-DEFAULT hover:bg-secondary-dark text-white transition-colors duration-150"
            title="Edit Activity"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-2 rounded-full bg-danger-DEFAULT hover:bg-danger-dark text-white transition-colors duration-150"
            title="Delete Activity"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
    