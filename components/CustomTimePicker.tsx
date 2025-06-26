import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

interface CustomTimePickerProps {
  initialTime: string; // HH:MM format
  onSetTime: (time: string) => void;
  onCancel: () => void;
  targetElementId: string; // Required to determine positioning relative to the trigger
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
// Updated MINUTES to include all minutes from 00 to 59
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ initialTime, onSetTime, onCancel, targetElementId }) => {
  const parseInitialTime = (time: string) => {
    if (time && time.includes(':')) {
      const [h, m] = time.split(':');
      return {
        hour: h.padStart(2, '0'),
        // Use exact minute, no snapping
        minute: m.padStart(2, '0'),
      };
    }
    const now = new Date();
    return {
      hour: now.getHours().toString().padStart(2, '0'),
      // Use current exact minute, no snapping
      minute: now.getMinutes().toString().padStart(2, '0'),
    };
  };

  const { hour: initialHour, minute: initialMinute } = parseInitialTime(initialTime);
  const [selectedHour, setSelectedHour] = useState<string>(initialHour);
  const [selectedMinute, setSelectedMinute] = useState<string>(initialMinute);
  const [positionAbove, setPositionAbove] = useState(false);
  
  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { hour, minute } = parseInitialTime(initialTime);
    setSelectedHour(hour);
    setSelectedMinute(minute);
  }, [initialTime]);
  
  useLayoutEffect(() => {
    if (pickerRef.current && targetElementId) {
      const targetElement = document.getElementById(targetElementId);
      if (targetElement) {
        const targetRect = targetElement.getBoundingClientRect();
        const pickerHeight = pickerRef.current.offsetHeight;
        const spaceBelow = window.innerHeight - targetRect.bottom;
        const spaceAbove = targetRect.top;

        if (spaceBelow < pickerHeight && spaceAbove >= pickerHeight) {
          setPositionAbove(true);
        } else {
          setPositionAbove(false);
        }
      }
    }
    // Scroll to selected time after position is determined and component rendered
    const scrollToSelected = (ref: React.RefObject<HTMLDivElement>, selectedValue: string, itemPrefix: string) => {
      if (ref.current) {
        const selectedItem = ref.current.querySelector(`#${itemPrefix}-${selectedValue.replace(':','')}`) as HTMLElement;
        if (selectedItem) {
          // Adjust scroll to center the item
          ref.current.scrollTop = selectedItem.offsetTop - ref.current.offsetTop - (ref.current.clientHeight / 2) + (selectedItem.clientHeight / 2) ;
        }
      }
    };
    scrollToSelected(hourListRef, selectedHour, 'hour');
    scrollToSelected(minuteListRef, selectedMinute, 'minute');

  }, [selectedHour, selectedMinute, targetElementId]); // Rerun if target changes


  const handleSet = () => {
    onSetTime(`${selectedHour}:${selectedMinute}`);
  };

  const itemClass = "p-2 text-center cursor-pointer hover:bg-slate-500 rounded-md transition-colors";
  const selectedItemClass = "bg-primary-DEFAULT text-white";

  const pickerDynamicPositionClass = positionAbove ? 'bottom-full mb-1' : 'top-full mt-1';

  return (
    <div 
        ref={pickerRef}
        className={`absolute left-0 w-full max-w-xs sm:max-w-sm md:w-64 bg-slate-700 border border-slate-600 rounded-lg shadow-xl p-4 z-20 ${pickerDynamicPositionClass}`}
        onClick={(e) => e.stopPropagation()} 
    >
      <div className="flex justify-between space-x-2 mb-3">
        <div className="flex-1">
          <p className="text-xs text-center text-gray-400 mb-1">Hour</p>
          <div ref={hourListRef} className="h-40 overflow-y-auto bg-slate-800 p-1 rounded-md border border-slate-600 custom-scrollbar">
            {HOURS.map(hour => (
              <div
                key={hour}
                id={`hour-${hour}`}
                className={`${itemClass} ${selectedHour === hour ? selectedItemClass : 'text-gray-300'}`}
                onClick={() => setSelectedHour(hour)}
                role="option"
                aria-selected={selectedHour === hour}
              >
                {hour}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1">
            <p className="text-xs text-center text-gray-400 mb-1">Minute</p>
            <div ref={minuteListRef} className="h-40 overflow-y-auto bg-slate-800 p-1 rounded-md border border-slate-600 custom-scrollbar">
                {MINUTES.map(minute => (
                <div
                    key={minute}
                    id={`minute-${minute}`}
                    className={`${itemClass} ${selectedMinute === minute ? selectedItemClass : 'text-gray-300'}`}
                    onClick={() => setSelectedMinute(minute)}
                    role="option"
                    aria-selected={selectedMinute === minute}
                >
                    {minute}
                </div>
                ))}
            </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2 border-t border-slate-600">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm bg-slate-600 hover:bg-slate-500 text-gray-200 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSet}
          className="px-4 py-2 text-sm bg-primary-DEFAULT hover:bg-primary-dark text-white rounded-md transition-colors"
        >
          Set Time
        </button>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4A5568; 
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #718096; 
        }
      `}</style>
    </div>
  );
};

export default CustomTimePicker;