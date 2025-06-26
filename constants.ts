
import { ActivityCategory, CategoryColorMap } from './types';

export const CATEGORIES: ActivityCategory[] = [
  ActivityCategory.WORK,
  ActivityCategory.PERSONAL,
  ActivityCategory.FITNESS,
  ActivityCategory.LEARNING,
  ActivityCategory.SOCIAL,
  ActivityCategory.OTHER,
];

export const CATEGORY_COLORS: CategoryColorMap = {
  [ActivityCategory.WORK]: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  [ActivityCategory.PERSONAL]: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  [ActivityCategory.FITNESS]: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  [ActivityCategory.LEARNING]: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  [ActivityCategory.SOCIAL]: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-300' },
  [ActivityCategory.OTHER]: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
};

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
    