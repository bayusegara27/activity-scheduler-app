
import React, { useState, useEffect, useCallback } from 'react';
import { Activity, ActivityCategory, AppView } from './types';
import Header from './components/Header';
import ActivityFormModal from './components/ActivityFormModal';
import ActivityList from './components/ActivityList';
import AnalyticsView from './components/AnalyticsView';
import { PlusCircleIcon } from './components/icons/PlusCircleIcon'; // Placeholder for actual icon import path
import { activityService } from './services/activityService';
import TodayView from './components/TodayView';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>(() => {
    const savedActivities = localStorage.getItem('activities');
    return savedActivities ? JSON.parse(savedActivities) : [];
  });
  const [currentView, setCurrentView] = useState<AppView>('today');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  const handleAddActivity = (activity: Omit<Activity, 'id' | 'isCompleted'>) => {
    setActivities(prev => [
      ...prev,
      { ...activity, id: Date.now().toString(), isCompleted: false },
    ]);
  };

  const handleUpdateActivity = (updatedActivity: Activity) => {
    setActivities(prev =>
      prev.map(act => (act.id === updatedActivity.id ? updatedActivity : act))
    );
    setEditingActivity(null);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(prev => prev.filter(act => act.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setActivities(prev =>
      prev.map(act =>
        act.id === id ? { ...act, isCompleted: !act.isCompleted } : act
      )
    );
  };

  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setShowAddModal(true);
  };

  const openAddModal = () => {
    setEditingActivity(null);
    setShowAddModal(true);
  }

  const renderView = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysActivities = activities.filter(act => act.date === today);
    const upcomingActivities = activityService.getUpcomingActivities(activities, 5);


    switch (currentView) {
      case 'today':
        return <TodayView 
                  activities={todaysActivities} 
                  upcomingActivities={upcomingActivities}
                  onEdit={openEditModal} 
                  onDelete={handleDeleteActivity} 
                  onToggleComplete={handleToggleComplete} 
                  onAddActivity={openAddModal}
                />;
      case 'all':
        return <ActivityList
                  activities={activities}
                  onEdit={openEditModal}
                  onDelete={handleDeleteActivity}
                  onToggleComplete={handleToggleComplete}
                />;
      case 'analytics':
        return <AnalyticsView activities={activities} />;
      default:
        return <TodayView 
                  activities={todaysActivities} 
                  upcomingActivities={upcomingActivities}
                  onEdit={openEditModal} 
                  onDelete={handleDeleteActivity} 
                  onToggleComplete={handleToggleComplete} 
                  onAddActivity={openAddModal}
                />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-700 text-gray-100">
      <Header currentView={currentView} setCurrentView={setCurrentView} onAddActivityClick={openAddModal} />
      
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>

      {showAddModal && (
        <ActivityFormModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setEditingActivity(null);
          }}
          onSave={editingActivity ? handleUpdateActivity : handleAddActivity}
          existingActivity={editingActivity}
        />
      )}
      <Footer />

      {/* Floating Add Activity Button for Mobile */}
      <button
        onClick={openAddModal}
        className="md:hidden fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-150 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        aria-label="Add new activity"
      >
        <PlusCircleIcon className="w-8 h-8" />
      </button>
    </div>
  );
};

export default App;
    