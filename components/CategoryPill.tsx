
import React from 'react';
import { ActivityCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface CategoryPillProps {
  category: ActivityCategory;
}

const CategoryPill: React.FC<CategoryPillProps> = ({ category }) => {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS[ActivityCategory.OTHER];
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${colors.bg} ${colors.text} border ${colors.border}`}
    >
      {category}
    </span>
  );
};

export default CategoryPill;
    