
import React from 'react';
import { Activity } from '../types';
import ActivityItem from './ActivityItem';
import EmptyState from './EmptyState';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { SunIcon } from './icons/SunIcon';
import { ArrowTrendingUpIcon } from './icons/ArrowTrendingUpIcon';


interface TodayViewProps {
  activities: Activity[];
  upcomingActivities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onAddActivity: () => void;
}

const TodayView: React.FC<TodayViewProps> = ({ activities, upcomingActivities, onEdit, onDelete, onToggleComplete, onAddActivity }) => {
  const sortedActivities = [...activities].sort((a, b) => {
    const timeA = new Date(`1970/01/01 ${a.startTime}`);
    const timeB = new Date(`1970/01/01 ${b.startTime}`);
    return timeA.getTime() - timeB.getTime();
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
          <SunIcon className="w-8 h-8 mr-3 text-yellow-400" />
          Today's Schedule ({new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })})
        </h2>
        {sortedActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedActivities.map(activity => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No Activities for Today"
            message="Looks like a quiet day! Or perhaps you'd like to add something?"
            actionButton={
                <button
                    onClick={onAddActivity}
                    className="mt-4 flex items-center bg-accent-DEFAULT hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Add Activity
                </button>
            }
          />
        )}
      </div>

      {upcomingActivities.length > 0 && (
         <div>
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <ArrowTrendingUpIcon className="w-7 h-7 mr-3 text-primary-light" />
                Upcoming Activities
            </h2>
            <div className="space-y-4">
            {upcomingActivities.map(activity => (
                <ActivityItem
                key={activity.id}
                activity={activity}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
                showDate={true}
                />
            ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default TodayView;
    