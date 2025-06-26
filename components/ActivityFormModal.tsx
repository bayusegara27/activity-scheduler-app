import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Activity, ActivityCategory } from '../types';
import { CATEGORIES } from '../constants';
import Modal from './Modal';
import { geminiService } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import CustomTimePicker from './CustomTimePicker';
import { SparklesIcon } from './icons/SparklesIcon';
import { SaveIcon } from './icons/SaveIcon';
import { CancelIcon } from './icons/CancelIcon';
// ClockIcon might not be needed if "Now" button is removed. Keep for now if used elsewhere.

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Activity | Omit<Activity, 'id' | 'isCompleted'>) => void;
  existingActivity?: Activity | null;
}

const ActivityFormModal: React.FC<ActivityFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingActivity,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [category, setCategory] = useState<ActivityCategory>(ActivityCategory.OTHER);
  const [isSuggestingTitle, setIsSuggestingTitle] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [activeTimePicker, setActiveTimePicker] = useState<'start' | 'end' | null>(null);

  const timeInputsContainerRef = useRef<HTMLDivElement>(null); // Ref for the container of both time inputs

  useEffect(() => {
    if (existingActivity) {
      setName(existingActivity.name);
      setDescription(existingActivity.description);
      setDate(existingActivity.date);
      setStartTime(existingActivity.startTime);
      setEndTime(existingActivity.endTime);
      setCategory(existingActivity.category);
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setName('');
      setDescription('');
      setStartTime('');
      setEndTime('');
      setCategory(ActivityCategory.OTHER);
    }
    setActiveTimePicker(null); 
  }, [existingActivity, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the time inputs container AND not on a trigger
      if (timeInputsContainerRef.current && !timeInputsContainerRef.current.contains(event.target as Node)) {
         const target = event.target as HTMLElement;
         if (!target.closest('[data-timepicker-trigger]')) {
            setActiveTimePicker(null);
         }
      }
      // If click is on a trigger, but outside the currently active picker's container, also close.
      // This is handled more directly by CustomTimePicker's internal logic and stopPropagation.
      // The main goal here is to close if clicking *completely* outside the time selection UI.
    };

    if (activeTimePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeTimePicker]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || !startTime || !endTime) {
        alert("Please fill in all required fields: Name, Date, Start Time, and End Time.");
        return;
    }
    if (startTime && endTime && endTime <= startTime) {
      alert("End Time must be after Start Time.");
      return;
    }
    
    const activityData = { name, description, date, startTime, endTime, category };
    if (existingActivity) {
      onSave({ ...existingActivity, ...activityData });
    } else {
      onSave(activityData);
    }
    onClose();
  };

  const handleSuggestTitle = useCallback(async () => {
    if (!description.trim()) {
      setSuggestionError("Please enter a description first to suggest a title.");
      return;
    }
    setIsSuggestingTitle(true);
    setSuggestionError(null);
    try {
      const suggestedTitle = await geminiService.suggestActivityTitle(description);
      setName(suggestedTitle);
    } catch (error) {
      console.error("Error suggesting title:", error);
      setSuggestionError("Could not suggest a title. Please try again.");
    } finally {
      setIsSuggestingTitle(false);
    }
  }, [description]);

  const formFieldClass = "p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent outline-none transition-colors text-gray-200 placeholder-gray-500";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";
  const timeDisplayClass = `${formFieldClass} w-full cursor-pointer text-center`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingActivity ? 'Edit Activity' : 'Add New Activity'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Activity Name and Suggestion */}
        <div>
          <label htmlFor="name" className={labelClass}>Activity Name <span className="text-red-500">*</span></label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${formFieldClass} w-full`}
              placeholder="e.g., Morning Jog"
              required
            />
            <button
              type="button"
              onClick={handleSuggestTitle}
              disabled={isSuggestingTitle || !description.trim()}
              className="px-4 py-2 bg-secondary-DEFAULT hover:bg-secondary-dark text-white rounded-md flex items-center justify-center disabled:opacity-50 transition-colors flex-shrink-0"
              title="Suggest title based on description"
            >
              {isSuggestingTitle ? <LoadingSpinner size="sm" /> : <SparklesIcon className="w-5 h-5" />}
            </button>
          </div>
          {suggestionError && <p className="text-red-400 text-xs mt-1">{suggestionError}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${formFieldClass} w-full min-h-[80px]`}
            placeholder="e.g., Quick run around the park"
          />
        </div>

        {/* Date and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="date" className={labelClass}>Date <span className="text-red-500">*</span></label>
                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${formFieldClass} w-full`} required />
            </div>
            <div>
                <label htmlFor="category" className={labelClass}>Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value as ActivityCategory)} className={`${formFieldClass} w-full`}>
                {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
                </select>
            </div>
        </div>

        {/* Time Inputs with Custom Picker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={timeInputsContainerRef}>
            {/* Start Time */}
            <div className="relative">
                <label htmlFor="startTimeDisplay" className={labelClass}>Start Time <span className="text-red-500">*</span></label>
                <div
                    id="startTimeDisplay"
                    data-timepicker-trigger="start"
                    onClick={() => setActiveTimePicker(activeTimePicker === 'start' ? null : 'start')}
                    className={timeDisplayClass}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTimePicker(activeTimePicker === 'start' ? null : 'start');}}
                    aria-haspopup="dialog"
                    aria-expanded={activeTimePicker === 'start'}
                >
                    {startTime || 'HH:MM'}
                </div>
                {activeTimePicker === 'start' && (
                    <CustomTimePicker
                        initialTime={startTime}
                        onSetTime={(time) => {
                            setStartTime(time);
                            setActiveTimePicker(null);
                        }}
                        onCancel={() => setActiveTimePicker(null)}
                        targetElementId="startTimeDisplay"
                    />
                )}
            </div>

            {/* End Time */}
            <div className="relative">
                <label htmlFor="endTimeDisplay" className={labelClass}>End Time <span className="text-red-500">*</span></label>
                 <div
                    id="endTimeDisplay"
                    data-timepicker-trigger="end"
                    onClick={() => setActiveTimePicker(activeTimePicker === 'end' ? null : 'end')}
                    className={timeDisplayClass}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTimePicker(activeTimePicker === 'end' ? null : 'end');}}
                    aria-haspopup="dialog"
                    aria-expanded={activeTimePicker === 'end'}
                >
                    {endTime || 'HH:MM'}
                </div>
                {activeTimePicker === 'end' && (
                    <CustomTimePicker
                        initialTime={endTime}
                        onSetTime={(time) => {
                            setEndTime(time);
                            setActiveTimePicker(null);
                        }}
                        onCancel={() => setActiveTimePicker(null)}
                        targetElementId="endTimeDisplay"
                    />
                )}
            </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => { onClose(); setActiveTimePicker(null);}}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-gray-200 rounded-md transition-colors flex items-center"
          >
            <CancelIcon className="w-5 h-5 mr-2" /> Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-primary-DEFAULT hover:bg-primary-dark text-white rounded-md transition-colors flex items-center"
          >
           <SaveIcon className="w-5 h-5 mr-2" /> {existingActivity ? 'Save Changes' : 'Add Activity'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ActivityFormModal;