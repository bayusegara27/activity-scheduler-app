
import { Activity, ActivityCategory } from '../types';
import { CATEGORIES } from '../constants';

export const activityService = {
  calculateDuration: (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    if (end <= start) return 0; // Or handle as error/overnight task
    return (end.getTime() - start.getTime()) / (1000 * 60); // Duration in minutes
  },

  formatDuration: (minutes: number): string => {
    if (minutes < 1) return "0m";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    let result = '';
    if (h > 0) result += `${h}h `;
    if (m > 0) result += `${m}m`;
    return result.trim() || "0m";
  },
  
  getAnalyticsData: (activities: Activity[]) => {
    const activitiesPerCategory = CATEGORIES.map(category => ({
      name: category,
      count: activities.filter(act => act.category === category).length,
    }));

    const timePerCategory = CATEGORIES.map(category => {
      const totalMinutes = activities
        .filter(act => act.category === category)
        .reduce((sum, act) => sum + activityService.calculateDuration(act.startTime, act.endTime), 0);
      return { name: category, value: totalMinutes }; // value is in minutes
    });

    const totalActivities = activities.length;
    const completedActivities = activities.filter(act => act.isCompleted).length;
    const totalTimeSpent = activities.reduce((sum, act) => sum + activityService.calculateDuration(act.startTime, act.endTime), 0);

    return {
      activitiesPerCategory,
      timePerCategory,
      totalActivities,
      completedActivities,
      totalTimeSpent, // in minutes
    };
  },

  getUpcomingActivities: (activities: Activity[], count: number = 5): Activity[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    return activities
      .filter(act => {
        const activityDate = new Date(`${act.date}T${act.startTime}`);
        return !act.isCompleted && activityDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, count);
  },
};
    