
import React, { useState, useMemo } from 'react';
import { Activity, ActivityCategory } from '../types';
import ActivityItem from './ActivityItem';
import { CATEGORIES } from '../constants';
import EmptyState from './EmptyState';
import { AdjustmentsHorizontalIcon } from './icons/AdjustmentsHorizontalIcon';
import { FunnelIcon } from './icons/FunnelIcon';

interface ActivityListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onEdit, onDelete, onToggleComplete }) => {
  const [filterCategory, setFilterCategory] = useState<ActivityCategory | 'all'>('all');
  const [filterCompletion, setFilterCompletion] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // 'desc' for newest first

  const filteredAndSortedActivities = useMemo(() => {
    return activities
      .filter(activity => {
        const categoryMatch = filterCategory === 'all' || activity.category === filterCategory;
        const completionMatch = 
          filterCompletion === 'all' ||
          (filterCompletion === 'completed' && activity.isCompleted) ||
          (filterCompletion === 'incomplete' && !activity.isCompleted);
        const searchMatch = 
          activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchTerm.toLowerCase());
        return categoryMatch && completionMatch && searchMatch;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      });
  }, [activities, filterCategory, filterCompletion, searchTerm, sortOrder]);

  const inputClass = "p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-1 focus:ring-primary-DEFAULT focus:border-transparent outline-none text-gray-200 placeholder-gray-400";

  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
            <FunnelIcon className="w-6 h-6 mr-2 text-primary-light" /> Filters & Sort
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${inputClass} lg:col-span-2`}
          />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as ActivityCategory | 'all')} className={inputClass}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={filterCompletion} onChange={(e) => setFilterCompletion(e.target.value as 'all' | 'completed' | 'incomplete')} className={inputClass}>
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')} className={inputClass}>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {filteredAndSortedActivities.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredAndSortedActivities.map(activity => (
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
      ) : (
        <EmptyState 
            title="No Activities Found"
            message={searchTerm || filterCategory !== 'all' || filterCompletion !== 'all' ? "Try adjusting your filters or search term." : "Add some activities to get started!"}
        />
      )}
    </div>
  );
};

export default ActivityList;
    